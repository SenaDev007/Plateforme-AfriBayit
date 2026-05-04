import { Injectable, Logger } from '@nestjs/common';

/**
 * Section 10.5 — Sécurisation Transactions Financières
 * Double validation 2FA, scoring fraude ML, audit trail SHA256, reporting BCEAO.
 */
@Injectable()
export class TransactionSecurityService {
  private readonly logger = new Logger(TransactionSecurityService.name);

  /** Section 10.5 — Double validation: transaction > 500K FCFA → 2FA obligatoire */
  requires2FA(amountXOF: number): boolean {
    return amountXOF > 500_000;
  }

  /** Section 10.5 — ML fraud scoring per transaction (0.0 - 1.0) */
  async computeTransactionRiskScore(params: {
    amount: number;
    buyerId: string;
    sellerId: string;
    country: string;
    paymentMethod: string;
    ipAddress: string;
    deviceFingerprint?: string;
  }): Promise<{ score: number; action: 'ALLOW' | 'REVIEW' | 'BLOCK'; reasons: string[] }> {
    let score = 0;
    const reasons: string[] = [];

    // High-value transaction signal
    if (params.amount > 50_000_000) {
      score += 0.15;
      reasons.push('Montant > 50M FCFA');
    }
    if (params.amount > 100_000_000) {
      score += 0.2;
      reasons.push('Montant > 100M FCFA');
    }

    // Cross-country transaction signal
    // In production: compare buyer country vs seller country vs IP geolocation
    if (params.paymentMethod === 'CRYPTO') {
      score += 0.25;
      reasons.push('Paiement crypto');
    }

    // Velocity: would check recent transactions from same buyer in production
    // Placeholder for ML model integration
    if (!params.deviceFingerprint) {
      score += 0.1;
      reasons.push('Device fingerprint absent');
    }

    const action = score > 0.85 ? 'BLOCK' : score > 0.5 ? 'REVIEW' : 'ALLOW';
    return { score: Math.min(score, 1.0), action, reasons };
  }

  /** Section 10.5 — Immutable audit trail with SHA256 hash */
  generateAuditHash(transactionData: {
    id: string;
    amount: number;
    buyerId: string;
    sellerId: string;
    timestamp: Date;
    previousHash?: string;
  }): string {
    const { createHash } = require('crypto') as typeof import('crypto');
    const payload = JSON.stringify({
      ...transactionData,
      timestamp: transactionData.timestamp.toISOString(),
    });
    return createHash('sha256').update(payload).digest('hex');
  }

  /** Section 10.5 — BCEAO/UEMOA anomalous transaction reporting */
  shouldReportBCEAO(params: { amount: number; riskScore: number; transactionType: string }): {
    shouldReport: boolean;
    reason: string;
  } {
    // BCEAO threshold: transactions > 15M FCFA or suspicious patterns
    if (params.amount > 15_000_000) {
      return { shouldReport: true, reason: 'Montant > seuil déclaratif BCEAO (15M FCFA)' };
    }
    if (params.riskScore > 0.7) {
      return { shouldReport: true, reason: `Score de risque élevé: ${params.riskScore}` };
    }
    return { shouldReport: false, reason: '' };
  }

  /** Section 10.5 — PCI DSS L1: verify no card data is stored */
  validatePCICompliance(data: Record<string, unknown>): {
    compliant: boolean;
    violations: string[];
  } {
    const violations: string[] = [];
    const sensitivePatterns = [
      { field: 'cardNumber', pattern: /\d{13,19}/ },
      { field: 'cvv', pattern: /^\d{3,4}$/ },
      { field: 'pan', pattern: /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/ },
    ];

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        for (const sp of sensitivePatterns) {
          if (sp.pattern.test(value)) {
            violations.push(`PCI violation: field "${key}" contains potential ${sp.field}`);
          }
        }
      }
    }

    return { compliant: violations.length === 0, violations };
  }
}
