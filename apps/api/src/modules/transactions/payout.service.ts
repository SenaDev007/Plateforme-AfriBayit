import { Injectable, Inject, Logger, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@afribayit/db';
import { FedaPayService } from './payments/fedapay.service';

/** Default Mobile Money operator per country code */
const DEFAULT_OPERATOR: Record<string, string> = {
  BJ: 'mtn_bj',
  CI: 'mtn_ci',
  BF: 'orange_bf',
  TG: 'moov_tg',
  GH: 'mtn_gh',
  SN: 'orange_sn',
};

@Injectable()
export class PayoutService {
  private readonly logger = new Logger(PayoutService.name);

  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly fedaPayService: FedaPayService,
  ) {}

  /**
   * Create a payout record and attempt transfer if seller has a phone number.
   * Called automatically when escrow is released.
   */
  async createAndTrigger(transactionId: string): Promise<void> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        seller: {
          select: { id: true, firstName: true, lastName: true, phone: true, country: true },
        },
      },
    });

    if (!transaction) {
      this.logger.warn(`Payout skipped: transaction ${transactionId} not found`);
      return;
    }

    // Idempotency — skip if payout already exists
    const existing = await this.prisma.payout.findUnique({ where: { transactionId } });
    if (existing) return;

    const seller = transaction.seller;
    const operator = DEFAULT_OPERATOR[seller.country] ?? 'mtn_bj';

    const payout = await this.prisma.payout.create({
      data: {
        transactionId,
        sellerId: seller.id,
        amount: transaction.amount,
        currency: transaction.currency,
        phone: seller.phone ?? null,
        operator: seller.phone ? operator : null,
        status: 'PENDING',
      },
    });

    if (!seller.phone) {
      this.logger.warn(`Payout ${payout.id} left PENDING: seller has no phone number`);
      return;
    }

    await this.triggerTransfer(payout.id, {
      phone: seller.phone,
      operator,
      firstName: seller.firstName,
      lastName: seller.lastName,
    });
  }

  /** Execute the FedaPay transfer for a given payout */
  async triggerTransfer(
    payoutId: string,
    overrides?: { phone: string; operator: string; firstName: string; lastName: string },
  ): Promise<void> {
    const payout = await this.prisma.payout.findUnique({
      where: { id: payoutId },
      include: {
        seller: { select: { firstName: true, lastName: true, phone: true, country: true } },
      },
    });

    if (!payout) throw new NotFoundException('Payout introuvable.');

    const phone = overrides?.phone ?? payout.phone;
    const operator =
      overrides?.operator ?? payout.operator ?? DEFAULT_OPERATOR[payout.seller.country] ?? 'mtn_bj';
    const firstName = overrides?.firstName ?? payout.seller.firstName;
    const lastName = overrides?.lastName ?? payout.seller.lastName;

    if (!phone) {
      this.logger.warn(`Payout ${payoutId}: no phone number, cannot transfer`);
      return;
    }

    await this.prisma.payout.update({
      where: { id: payoutId },
      data: { status: 'INITIATED', initiatedAt: new Date(), phone, operator },
    });

    try {
      const { externalId } = await this.fedaPayService.initiatePayout({
        amount: Number(payout.amount),
        currency: payout.currency,
        phone,
        operator,
        firstName,
        lastName,
        reference: payout.id,
      });

      await this.prisma.payout.update({
        where: { id: payoutId },
        data: { providerRef: externalId, status: 'COMPLETED', completedAt: new Date() },
      });

      this.logger.log(`Payout ${payoutId} completed — FedaPay ref: ${externalId}`);
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'Unknown error';
      await this.prisma.payout.update({
        where: { id: payoutId },
        data: { status: 'FAILED', failureReason: reason },
      });
      this.logger.error(`Payout ${payoutId} failed: ${reason}`);
    }
  }

  async findAll() {
    return this.prisma.payout.findMany({
      include: {
        seller: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        transaction: { select: { reference: true, type: true, currency: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySeller(sellerId: string) {
    return this.prisma.payout.findMany({
      where: { sellerId },
      include: { transaction: { select: { reference: true, type: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async retry(id: string, adminId: string, phone?: string, operator?: string) {
    const payout = await this.prisma.payout.findUnique({
      where: { id },
      include: {
        seller: { select: { firstName: true, lastName: true, phone: true, country: true } },
      },
    });
    if (!payout) throw new NotFoundException('Payout introuvable.');

    this.logger.log(`Payout ${id} retry triggered by admin ${adminId}`);

    await this.triggerTransfer(
      id,
      phone && operator
        ? {
            phone,
            operator,
            firstName: payout.seller.firstName,
            lastName: payout.seller.lastName,
          }
        : undefined,
    );
  }
}
