import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import type {
  PrismaClient,
  Transaction,
  TransactionType,
  PaymentMethod,
  Currency,
} from '@afribayit/db';
import { EscrowService } from './escrow.service';
import { FedaPayService } from './payments/fedapay.service';
import { StripeService } from './payments/stripe.service';
import { AuthService } from '../auth/auth.service';
import { PayoutService } from './payout.service';

const LARGE_AMOUNT_THRESHOLD_XOF = 100_000;

interface CreateTransactionDto {
  type: TransactionType;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  buyerId: string;
  sellerId: string;
  propertyId?: string;
  hotelBookingId?: string;
  artisanServiceId?: string;
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly escrowService: EscrowService,
    private readonly fedapayService: FedaPayService,
    private readonly stripeService: StripeService,
    private readonly authService: AuthService,
    private readonly payoutService: PayoutService,
  ) {}

  /** Initiate a new transaction and create escrow account */
  async create(
    dto: CreateTransactionDto,
  ): Promise<{ transaction: Transaction; paymentUrl?: string; clientSecret?: string }> {
    const transaction = await this.prisma.transaction.create({
      data: {
        type: dto.type,
        amount: dto.amount,
        currency: dto.currency as Currency,
        paymentMethod: dto.paymentMethod,
        buyerId: dto.buyerId,
        sellerId: dto.sellerId,
        ...(dto.propertyId !== undefined ? { propertyId: dto.propertyId } : {}),
        ...(dto.hotelBookingId !== undefined ? { hotelBookingId: dto.hotelBookingId } : {}),
        ...(dto.artisanServiceId !== undefined ? { artisanServiceId: dto.artisanServiceId } : {}),
        status: 'INITIATED',
        escrowAccount: {
          create: {
            balance: 0,
            currency: dto.currency as Currency,
          },
        },
      },
    });

    // Route to correct payment provider
    if (dto.paymentMethod === 'MOBILE_MONEY_FEDAPAY') {
      const result = await this.fedapayService.initiatePayment({
        amount: dto.amount,
        currency: dto.currency,
        description: `AfriBayit — Transaction ${transaction.reference}`,
        callbackUrl: `${process.env['NEXT_PUBLIC_API_URL']}/v1/transactions/webhook/fedapay`,
        reference: transaction.reference,
      });
      return { transaction, paymentUrl: result.paymentUrl };
    }

    if (dto.paymentMethod === 'CARD_STRIPE') {
      const result = await this.stripeService.createPaymentIntent({
        amount: dto.amount,
        currency: dto.currency,
        description: `AfriBayit — Transaction ${transaction.reference}`,
        reference: transaction.reference,
      });

      // Store intent ID for later retrieval + record in payments table
      await this.prisma.$transaction([
        this.prisma.transaction.update({
          where: { id: transaction.id },
          data: { metadata: { stripePaymentIntentId: result.paymentIntentId } },
        }),
        this.prisma.payment.create({
          data: {
            transactionId: transaction.id,
            method: 'CARD_STRIPE',
            amount: dto.amount,
            currency: dto.currency as Currency,
            providerRef: result.paymentIntentId,
            providerStatus: 'pending',
          },
        }),
      ]);

      return { transaction, clientSecret: result.clientSecret };
    }

    return { transaction };
  }

  /** Get transactions for a user */
  async findByUser(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        property: { select: { title: true, slug: true } },
        buyer: { select: { id: true, firstName: true, lastName: true } },
        seller: { select: { id: true, firstName: true, lastName: true } },
        escrowAccount: { select: { balance: true, currency: true } },
      },
      orderBy: { createdAt: 'desc' },
    }) as unknown as Transaction[];
  }

  /** Get single transaction — only buyer or seller can access */
  async findOne(id: string, userId: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: { escrowAccount: true, ledgerEntries: true, payments: true },
    });

    if (!transaction) throw new NotFoundException('Transaction introuvable.');
    if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
      throw new ForbiddenException('Accès refusé.');
    }

    return transaction;
  }

  /** Buyer confirms goods received — release escrow.
   *  For amounts > 100 000 XOF, a valid TOTP code is required when 2FA is enabled. */
  async releaseEscrow(
    transactionId: string,
    buyerId: string,
    totpCode?: string,
  ): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUniqueOrThrow({
      where: { id: transactionId },
    });
    if (transaction.buyerId !== buyerId)
      throw new ForbiddenException("Seul l'acheteur peut libérer les fonds.");

    const isLargeAmount =
      transaction.currency === 'XOF' && Number(transaction.amount) >= LARGE_AMOUNT_THRESHOLD_XOF;

    if (isLargeAmount) {
      const has2FA = await this.authService.is2FAEnabled(buyerId);
      if (has2FA) {
        if (!totpCode)
          throw new UnauthorizedException(
            'Un code 2FA est requis pour libérer des fonds supérieurs à 100 000 FCFA.',
          );
        const valid = await this.authService.verifyTotpCode(buyerId, totpCode);
        if (!valid) throw new UnauthorizedException('Code 2FA invalide.');
      }
    }

    const released = await this.escrowService.transition(
      transactionId,
      'RELEASED',
      buyerId,
      "Libération confirmée par l'acheteur",
    );

    // Fire-and-forget payout — errors are logged but don't fail the release
    this.payoutService.createAndTrigger(transactionId).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[Payout] auto-trigger failed for ${transactionId}: ${msg}`);
    });

    return released;
  }

  /** Return 2FA requirements for a release operation */
  async getReleaseRequirements(transactionId: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) throw new NotFoundException('Transaction introuvable.');
    if (transaction.buyerId !== userId) throw new ForbiddenException('Accès refusé.');

    const isLargeAmount =
      transaction.currency === 'XOF' && Number(transaction.amount) >= LARGE_AMOUNT_THRESHOLD_XOF;
    const has2FA = isLargeAmount ? await this.authService.is2FAEnabled(userId) : false;

    return {
      requires2FA: isLargeAmount && has2FA,
      isLargeAmount,
      threshold: LARGE_AMOUNT_THRESHOLD_XOF,
    };
  }

  /** Return Stripe client_secret for a CARD_STRIPE transaction — buyer only */
  async getStripeClientSecret(transactionId: string, buyerId: string): Promise<string> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new NotFoundException('Transaction introuvable.');
    if (transaction.buyerId !== buyerId) throw new ForbiddenException('Accès refusé.');

    const meta = transaction.metadata as { stripePaymentIntentId?: string } | null;
    const intentId = meta?.stripePaymentIntentId;
    if (!intentId)
      throw new NotFoundException('Aucun paiement Stripe associé à cette transaction.');

    const secret = await this.stripeService.getClientSecret(intentId);
    return secret;
  }

  /** Handle Stripe webhook — fund escrow on payment_intent.succeeded */
  async handleStripeWebhook(rawBody: Buffer, signature: string): Promise<void> {
    let event;
    try {
      event = this.stripeService.constructWebhookEvent(rawBody, signature);
    } catch {
      this.logger.warn('Stripe webhook signature verification failed');
      return;
    }

    const intent = event.data.object as {
      id: string;
      metadata?: { reference?: string };
      amount: number;
      currency: string;
    };
    const reference = intent.metadata?.reference;
    if (!reference) return;

    const transaction = await this.prisma.transaction.findFirst({ where: { reference } });
    if (!transaction) return;

    if (event.type === 'payment_intent.succeeded') {
      if (transaction.status !== 'INITIATED') return; // idempotency

      await this.prisma.payment.updateMany({
        where: { transactionId: transaction.id, providerRef: intent.id },
        data: { providerStatus: 'succeeded' },
      });

      await this.escrowService.fundEscrow(transaction.id, transaction.amount);
      await this.escrowService.transition(
        transaction.id,
        'FUNDED',
        'SYSTEM',
        'Stripe payment_intent.succeeded',
      );
      this.logger.log(`Escrow funded via Stripe for transaction ${transaction.reference}`);
    }

    if (event.type === 'payment_intent.payment_failed') {
      if (!['INITIATED', 'FUNDED'].includes(transaction.status)) return;

      await this.prisma.payment.updateMany({
        where: { transactionId: transaction.id, providerRef: intent.id },
        data: { providerStatus: 'failed' },
      });

      await this.escrowService.transition(
        transaction.id,
        'CANCELLED',
        'SYSTEM',
        'Stripe payment_intent.payment_failed',
      );
      this.logger.warn(`Transaction ${transaction.reference} cancelled — Stripe payment failed`);
    }
  }

  /** Handle FedaPay webhook */
  async handleFedaPayWebhook(payload: Record<string, unknown>, signature: string): Promise<void> {
    if (!this.fedapayService.verifyWebhook(payload, signature)) return;

    const reference = (payload['metadata'] as { reference?: string })?.reference;
    if (!reference) return;

    const transaction = await this.prisma.transaction.findFirst({ where: { reference } });
    if (!transaction) return;

    const status = this.fedapayService.mapStatus(String(payload['status']));
    if (status === 'FUNDED') {
      await this.escrowService.fundEscrow(transaction.id, transaction.amount);
      await this.escrowService.transition(
        transaction.id,
        'FUNDED',
        'SYSTEM',
        'FedaPay payment confirmed',
      );
    } else if (status === 'CANCELLED') {
      await this.escrowService.transition(
        transaction.id,
        'CANCELLED',
        'SYSTEM',
        'FedaPay payment failed',
      );
    }
  }
}
