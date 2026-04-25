import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
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
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly escrowService: EscrowService,
    private readonly fedapayService: FedaPayService,
    private readonly stripeService: StripeService,
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
        escrowAccount: true,
      },
      orderBy: { createdAt: 'desc' },
    });
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

  /** Buyer confirms goods received — release escrow */
  async releaseEscrow(transactionId: string, buyerId: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUniqueOrThrow({
      where: { id: transactionId },
    });
    if (transaction.buyerId !== buyerId)
      throw new ForbiddenException("Seul l'acheteur peut libérer les fonds.");
    return this.escrowService.transition(
      transactionId,
      'RELEASED',
      buyerId,
      "Libération confirmée par l'acheteur",
    );
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
