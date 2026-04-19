import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import type { PrismaClient, Transaction, TransactionStatus } from '@afribayit/db';
import { Decimal } from '@prisma/client/runtime/library';

/** Valid state machine transitions for escrow */
const VALID_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  INITIATED: ['FUNDED', 'CANCELLED'],
  FUNDED: ['VALIDATED', 'DISPUTED', 'CANCELLED'],
  VALIDATED: ['RELEASED', 'DISPUTED'],
  RELEASED: ['COMPLETED'],
  COMPLETED: [],
  DISPUTED: ['RELEASED', 'REFUNDED', 'CANCELLED'],
  CANCELLED: [],
  REFUNDED: [],
};

@Injectable()
export class EscrowService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  /** Transition escrow to next state with full ledger audit trail */
  async transition(
    transactionId: string,
    toStatus: TransactionStatus,
    actorId: string,
    note?: string,
  ): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { escrowAccount: true },
    });

    if (!transaction) throw new NotFoundException('Transaction introuvable.');

    const allowed = VALID_TRANSITIONS[transaction.status];
    if (!allowed.includes(toStatus)) {
      throw new BadRequestException(
        `Transition invalide : ${transaction.status} → ${toStatus}. Transitions autorisées : ${allowed.join(', ')}.`,
      );
    }

    // Execute state change + ledger entry atomically
    const [updated] = await this.prisma.$transaction([
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: toStatus,
          completedAt: toStatus === 'COMPLETED' ? new Date() : undefined,
          disputedAt: toStatus === 'DISPUTED' ? new Date() : undefined,
        },
      }),
      this.prisma.ledgerEntry.create({
        data: {
          transactionId,
          type: this.getLedgerType(toStatus),
          amount: transaction.amount,
          currency: transaction.currency,
          description: `${transaction.status} → ${toStatus}${note ? ` | ${note}` : ''} | Acteur: ${actorId}`,
          balanceBefore: transaction.escrowAccount?.balance ?? new Decimal(0),
          balanceAfter: this.getNewBalance(transaction.escrowAccount?.balance, transaction.amount, toStatus),
          metadata: { fromStatus: transaction.status, toStatus, actorId },
        },
      }),
    ]);

    return updated;
  }

  /** Fund escrow account — called after successful payment */
  async fundEscrow(transactionId: string, amount: Decimal): Promise<void> {
    await this.prisma.escrowAccount.upsert({
      where: { transactionId },
      create: {
        transactionId,
        balance: amount,
        currency: 'XOF',
        lockedAt: new Date(),
      },
      update: {
        balance: { increment: amount },
        lockedAt: new Date(),
      },
    });
  }

  private getLedgerType(status: TransactionStatus): string {
    const map: Partial<Record<TransactionStatus, string>> = {
      FUNDED: 'CREDIT',
      RELEASED: 'DEBIT',
      REFUNDED: 'REFUND',
      CANCELLED: 'DEBIT',
    };
    return map[status] ?? 'DEBIT';
  }

  private getNewBalance(
    current: Decimal | undefined,
    amount: Decimal,
    status: TransactionStatus,
  ): Decimal {
    const bal = current ?? new Decimal(0);
    if (status === 'FUNDED') return bal.add(amount);
    if (['RELEASED', 'REFUNDED', 'CANCELLED'].includes(status)) return new Decimal(0);
    return bal;
  }
}
