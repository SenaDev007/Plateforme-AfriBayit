import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaClient, Country, Notary, NotaryAssignment } from '@afribayit/db';

@Injectable()
export class NotaryService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  /** Assigns the next available notary in the given country/jurisdiction using Round-Robin */
  async assignNotary(
    transactionId: string,
    country: Country,
    city?: string,
  ): Promise<NotaryAssignment> {
    // 1. Find all available notaries in the jurisdiction
    const availableNotaries = await this.prisma.notary.findMany({
      where: {
        jurisdiction: country,
        isAvailable: true,
        ...(city ? { city } : {}),
      },
      orderBy: { transactionsCount: 'asc' }, // Simple load balancing: take the one with least transactions
    });

    if (availableNotaries.length === 0) {
      // Fallback: search in the whole country if city-specific notaries are not found
      if (city) return this.assignNotary(transactionId, country);
      throw new NotFoundException(`Aucun notaire disponible pour la juridiction ${country}`);
    }

    const selectedNotary = availableNotaries[0];

    // 2. Create the assignment
    const assignment = await this.prisma.notaryAssignment.create({
      data: {
        transactionId,
        notaryId: selectedNotary.id,
        status: 'ASSIGNED',
      },
    });

    // 3. Update notary stats
    await this.prisma.notary.update({
      where: { id: selectedNotary.id },
      data: { transactionsCount: { increment: 1 } },
    });

    // 4. Update transaction status
    await this.prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'NOTARY_ASSIGNED' },
    });

    return assignment;
  }

  /** Update assignment status (signed, registered, etc.) */
  async updateAssignmentStatus(
    assignmentId: string,
    status: 'IN_PROGRESS' | 'SIGNED' | 'REGISTERED',
    notes?: string,
    deedHash?: string,
  ): Promise<NotaryAssignment> {
    const assignment = await this.prisma.notaryAssignment.update({
      where: { id: assignmentId },
      data: {
        status,
        ...(notes ? { notes } : {}),
        ...(deedHash ? { deedHash } : {}),
        ...(status === 'REGISTERED' ? { completedAt: new Date() } : {}),
      },
    });

    // Update global transaction status accordingly
    const txStatusMap: Record<string, any> = {
      IN_PROGRESS: 'NOTARY_IN_PROGRESS',
      SIGNED: 'DEED_SIGNED',
      REGISTERED: 'ANDF_REGISTERED',
    };

    if (txStatusMap[status]) {
      await this.prisma.transaction.update({
        where: { id: assignment.transactionId },
        data: { status: txStatusMap[status] },
      });
    }

    return assignment;
  }

  /** Find assignment by transaction ID */
  async findByTransaction(transactionId: string): Promise<NotaryAssignment | null> {
    return this.prisma.notaryAssignment.findUnique({
      where: { transactionId },
      include: {
        notary: {
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
        },
      },
    });
  }

  /** List notaries by jurisdiction */
  async listNotaries(country: Country): Promise<Notary[]> {
    return this.prisma.notary.findMany({
      where: { jurisdiction: country },
      include: { user: { select: { firstName: true, lastName: true, avatar: true, city: true } } },
    });
  }
}
