import { PrismaClient, EscrowStatus, MissionStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface EscrowConditions {
  buyerConfirm: boolean;
  sellerConfirm: boolean;
  docsValid: boolean;
  inspectionValid: boolean;
  fraudHoldExpired: boolean;
  adminValid: boolean;
}

/**
 * Section 7B.3.2 - Moteur Escrow Avancé
 */
export class EscrowEngine {
  /**
   * Evaluate if funds can be released based on transaction type and conditions
   */
  static async evaluateRelease(escrowId: string) {
    const escrow = await prisma.escrow.findUnique({
      where: { id: escrowId },
      include: { transaction: true },
    });

    if (!escrow || escrow.status !== 'FUNDED') return false;

    const conditions = escrow.conditions as unknown as EscrowConditions;
    const tx = escrow.transaction;

    let isReady = false;

    // Logic per transaction type (Section 7B.3.2)
    switch (tx.type) {
      case 'SALE':
        // Docs + Inspection + Buyer Confirm
        isReady = conditions.docsValid && conditions.inspectionValid && conditions.buyerConfirm;
        break;

      case 'RENT_SHORT':
        // Check-in + 24h safety
        isReady = conditions.buyerConfirm && conditions.fraudHoldExpired;
        break;

      case 'ARTISAN':
      case 'GEOMETER':
        // Delivery + Buyer Confirm
        isReady = conditions.sellerConfirm && conditions.buyerConfirm;
        break;

      default:
        isReady = conditions.buyerConfirm;
    }

    if (isReady) {
      await this.releaseFunds(escrowId);
      return true;
    }

    return false;
  }

  private static async releaseFunds(escrowId: string) {
    // 1. Update Escrow status
    // 2. Update Transaction status to RELEASED
    // 3. Move funds in Ledger (Section 7B.4.2)
    // 4. Update Wallets (Deduct from Escrow, Add to Seller Available)

    console.log(`[EscrowEngine] Releasing funds for ${escrowId}`);

    // Impl detail: This would be a database transaction
    await prisma.$transaction([
      prisma.escrow.update({
        where: { id: escrowId },
        data: { status: 'RELEASED', releaseTriggered: true },
      }),
      // ... further ledger and wallet updates
    ]);
  }

  /**
   * Section 7C.5.2 - Sync Geometer Mission with Escrow
   */
  static async syncGeometerValidation(missionId: string) {
    const mission = await prisma.geometerMission.findUnique({
      where: { id: missionId },
      include: { property: { include: { transactions: { where: { status: 'FUNDED' } } } } },
    });

    if (mission?.status === 'COMPLETED' && mission.property.transactions.length > 0) {
      const txId = mission.property.transactions[0].id;
      const escrow = await prisma.escrow.findUnique({ where: { transactionId: txId } });

      if (escrow) {
        const currentConditions = escrow.conditions as any;
        await prisma.escrow.update({
          where: { id: escrow.id },
          data: {
            conditions: {
              ...currentConditions,
              inspectionValid: true,
            },
          },
        });

        // Re-evaluate release
        await this.evaluateRelease(escrow.id);
      }
    }
  }
}
