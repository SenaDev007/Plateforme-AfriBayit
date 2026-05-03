import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient, CommissionStatus } from '@afribayit/db';
import { nanoid } from 'nanoid';

@Injectable()
export class AmbassadorService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  /** Generates a unique referral code for a user */
  async generateCode(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    if (user.referralCode) return user.referralCode;

    const code = nanoid(8).toUpperCase();
    await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });
    return code;
  }

  /** Gets ambassador statistics */
  async getStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: { select: { referrals: true } },
        commissions: {
          where: { status: 'PAID' },
        },
      },
    });

    if (!user) throw new NotFoundException('Ambassadeur introuvable');

    const totalPaid = user.commissions.reduce((sum, c) => sum + c.amount, 0);
    const pendingCommissions = await this.prisma.commission.aggregate({
      where: { userId, status: 'PENDING' },
      _sum: { amount: true },
    });

    return {
      referralCode: user.referralCode,
      points: user.points,
      referralCount: user._count.referrals,
      earningsPaid: totalPaid,
      earningsPending: pendingCommissions._sum.amount || 0,
      recentReferrals: await this.prisma.user.findMany({
        where: { referredById: userId },
        take: 5,
        select: { firstName: true, createdAt: true, kycLevel: true },
        orderBy: { createdAt: 'desc' },
      }),
    };
  }

  /** Calculates and records a commission for a transaction */
  async recordCommission(transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { buyer: true },
    });

    if (!transaction || !transaction.buyer.referredById) return;

    const referrerId = transaction.buyer.referredById;
    // Standard commission: 5% of transaction amount (can be adjusted)
    const commissionAmount = Number(transaction.amount) * 0.05;

    return this.prisma.commission.create({
      data: {
        userId: referrerId,
        transactionId,
        amount: commissionAmount,
        currency: transaction.currency,
        status: 'PENDING',
        notes: `Commission 5% sur transaction ${transaction.reference}`,
      },
    });
  }

  /** Rewards points for specific actions (e.g., KYC Level 2) */
  async awardPoints(userId: string, points: number, reason: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    });
  }
}
