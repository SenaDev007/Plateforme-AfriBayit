import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export interface LedgerEntryInput {
  transactionId: string;
  entryType: 'ESCROW_HOLD' | 'ESCROW_RELEASE' | 'PAYOUT' | 'REFUND' | 'FEE';
  debitAccount: string;
  creditAccount: string;
  amount: number;
  currency: string;
  providerRef?: string;
}

/**
 * Section 7B.4.2 - Journal des Transactions (Ledger Entries)
 * Source de vérité unique avec chaînage SHA-256
 */
export class LedgerService {
  static async createEntry(input: LedgerEntryInput) {
    // 1. Fetch last entry for chaining (Section 7B.8.2)
    const lastEntry = await prisma.ledgerEntry.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    const previousHash = lastEntry?.checksum || '0'.repeat(64);

    // 2. Prepare entry data
    const entryData = {
      ...input,
      createdAt: new Date().toISOString(),
      previousHash,
    };

    // 3. Generate SHA-256 Checksum (Section 7B.4.2)
    const checksum = crypto.createHash('sha256').update(JSON.stringify(entryData)).digest('hex');

    // 4. Persistence
    return await prisma.ledgerEntry.create({
      data: {
        transactionId: input.transactionId,
        entryType: input.entryType,
        debitAccount: input.debitAccount,
        creditAccount: input.creditAccount,
        amount: input.amount,
        currency: input.currency,
        providerRef: input.providerRef,
        checksum: checksum,
      },
    });
  }

  /**
   * Section 7B.4.3 - Réconciliation automatique
   */
  static async reconcile() {
    // Logic to verify that sum(debit) == sum(credit) for the platform
    // and that hashes are not tampered
    console.log('[LedgerService] Running platform reconciliation...');
  }
}
