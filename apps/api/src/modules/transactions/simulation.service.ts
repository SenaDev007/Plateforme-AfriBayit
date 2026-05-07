import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PrismaClient, Transaction, Country, UserRole } from '@afribayit/db';
import * as bcrypt from 'bcryptjs';
import { EscrowService } from './escrow.service';
import { NotaryService } from '../notary/notary.service';
import { GeoTrustService } from '../geotrust/geotrust.service';

@Injectable()
export class TransactionSimulationService {
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly escrowService: EscrowService,
    private readonly notaryService: NotaryService,
    private readonly geoTrustService: GeoTrustService,
  ) {}

  /** Seeds a complete test environment */
  async seedTestEnvironment() {
    const passwordHash = await bcrypt.hash('Password123!', 12);

    // 1. Create Test Users
    const buyer = await this.prisma.user.upsert({
      where: { email: 'buyer@test.com' },
      update: {},
      create: {
        email: 'buyer@test.com',
        firstName: 'Acheteur',
        lastName: 'Test',
        passwordHash,
        role: 'BUYER',
      },
    });

    const seller = await this.prisma.user.upsert({
      where: { email: 'seller@test.com' },
      update: {},
      create: {
        email: 'seller@test.com',
        firstName: 'Vendeur',
        lastName: 'Test',
        passwordHash,
        role: 'SELLER',
      },
    });

    const notaryUser = await this.prisma.user.upsert({
      where: { email: 'notaire@test.com' },
      update: {},
      create: {
        email: 'notaire@test.com',
        firstName: 'Maitre',
        lastName: 'Notaire',
        passwordHash,
        role: 'NOTARY',
      },
    });

    const notary = await this.prisma.notary.upsert({
      where: { userId: notaryUser.id },
      update: { isAvailable: true },
      create: {
        userId: notaryUser.id,
        jurisdiction: 'BJ',
        chamberId: 'CH-BJ-001',
        isAvailable: true,
      },
    });

    // 2. Create Test Property
    const property = await this.prisma.property.upsert({
      where: { slug: 'terrain-test-cotonou' },
      update: {},
      create: {
        slug: 'terrain-test-cotonou',
        title: 'Terrain de Test - Cotonou',
        description: 'Magnifique terrain pour tests techniques.',
        type: 'LAND',
        purpose: 'SALE',
        price: 15000000,
        currency: 'XOF',
        country: 'BJ',
        city: 'Cotonou',
        ownerId: seller.id,
      },
    });

    return { buyer, seller, notaryUser, property };
  }

  /** Forcefully advances a transaction to a specific status for testing */
  async forceStatus(transactionId: string, status: string) {
    const transaction = await this.prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!transaction) throw new NotFoundException('Transaction non trouvée.');

    if (status === 'FUNDED') {
      await this.escrowService.fundEscrow(transactionId, transaction.amount);
      return this.escrowService.transition(transactionId, 'FUNDED', 'SYSTEM', 'Simulated funding');
    }

    if (status === 'NOTARY_ASSIGNED') {
      // Ensure it is funded first
      if (transaction.status === 'INITIATED') await this.forceStatus(transactionId, 'FUNDED');

      const prop = await this.prisma.property.findUnique({
        where: { id: transaction.propertyId! },
      });
      return this.notaryService.assignNotary(transactionId, prop!.country, prop!.city);
    }

    // Direct transition for others
    return this.escrowService.transition(
      transactionId,
      status as any,
      'SYSTEM',
      `Forced transition to ${status}`,
    );
  }
}
