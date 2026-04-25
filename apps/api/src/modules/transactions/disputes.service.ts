import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import type { PrismaClient } from '@afribayit/db';

@Injectable()
export class DisputesService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async open(transactionId: string, userId: string, reason: string, description?: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { dispute: true },
    });

    if (!transaction) throw new NotFoundException('Transaction introuvable.');
    if (transaction.buyerId !== userId)
      throw new ForbiddenException("Seul l'acheteur peut ouvrir un litige.");
    if (!['FUNDED', 'VALIDATED', 'RELEASED'].includes(transaction.status))
      throw new ForbiddenException(
        "Un litige ne peut être ouvert qu'une transaction en cours (FUNDED/VALIDATED/RELEASED).",
      );
    if (transaction.dispute)
      throw new ConflictException('Un litige est déjà ouvert pour cette transaction.');

    const [dispute] = await this.prisma.$transaction([
      this.prisma.dispute.create({
        data: { transactionId, reason, description: description ?? null },
      }),
      this.prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'DISPUTED', disputedAt: new Date() },
      }),
    ]);

    return dispute;
  }

  async findForTransaction(transactionId: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new NotFoundException('Transaction introuvable.');
    if (transaction.buyerId !== userId && transaction.sellerId !== userId)
      throw new ForbiddenException('Accès refusé.');

    return this.prisma.dispute.findUnique({ where: { transactionId } });
  }

  async findAll() {
    return this.prisma.dispute.findMany({
      include: {
        transaction: {
          select: {
            reference: true,
            amount: true,
            currency: true,
            type: true,
            buyer: { select: { id: true, firstName: true, lastName: true, email: true } },
            seller: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolve(id: string, adminId: string, resolution: string, action: 'RESOLVED' | 'REFUNDED') {
    const dispute = await this.prisma.dispute.findUnique({
      where: { id },
      include: { transaction: true },
    });
    if (!dispute) throw new NotFoundException('Litige introuvable.');
    if (dispute.status !== 'OPEN' && dispute.status !== 'UNDER_REVIEW')
      throw new ConflictException('Ce litige est déjà résolu.');

    const newTxStatus = action === 'REFUNDED' ? 'REFUNDED' : 'COMPLETED';

    const [updated] = await this.prisma.$transaction([
      this.prisma.dispute.update({
        where: { id },
        data: {
          status: action,
          resolution,
          resolvedBy: adminId,
          resolvedAt: new Date(),
        },
      }),
      this.prisma.transaction.update({
        where: { id: dispute.transactionId },
        data: { status: newTxStatus },
      }),
    ]);

    return updated;
  }

  async markUnderReview(id: string) {
    const dispute = await this.prisma.dispute.findUnique({ where: { id } });
    if (!dispute) throw new NotFoundException('Litige introuvable.');
    return this.prisma.dispute.update({
      where: { id },
      data: { status: 'UNDER_REVIEW' },
    });
  }
}
