import { Currency } from './types';

/**
 * Section 7B.6 - Gestion Multi-Devises
 * Taux de change gelés et source de vérité (BCEAO/Fixer.io)
 */
export class CurrencyService {
  private static readonly FIXED_EUR_XOF = 655.957;

  /**
   * Convert amount between currencies with platform safety margin
   */
  static convert(amount: number, from: Currency, to: Currency): number {
    if (from === to) return amount;

    // Standard UEMOA Fix (Section 7B.6)
    if (from === 'EUR' && to === 'XOF') return amount * this.FIXED_EUR_XOF;
    if (from === 'XOF' && to === 'EUR') return amount / this.FIXED_EUR_XOF;

    // For other currencies (USD, NGN...), we use mid-market rates (mocked for now)
    // In production, this would call Fixer.io or Open Exchange Rates
    const mockRates: Record<string, number> = {
      USD_XOF: 605.5,
      XOF_USD: 1 / 605.5,
      NGN_XOF: 0.45,
      XOF_NGN: 1 / 0.45,
    };

    const key = `${from}_${to}`;
    return amount * (mockRates[key] || 1);
  }
}

/**
 * Section 7B.7.2 - Règles de Payout et KYC
 */
export class PayoutService {
  static readonly MINIMUM_PAYOUT_XOF = 1000;
  static readonly MINIMUM_PAYOUT_EUR = 10;
  static readonly KYC_THRESHOLD_XOF = 1_000_000;

  static async validatePayoutRequest(userId: string, amount: number, currency: Currency) {
    // 1. Check minimums (Section 7B.7.2)
    if (currency === 'XOF' && amount < this.MINIMUM_PAYOUT_XOF) {
      throw new Error(`Minimum payout is ${this.MINIMUM_PAYOUT_XOF} XOF`);
    }

    // 2. Check KYC level (Section 7B.8.1)
    // Mocking user KYC fetch
    const userKycLevel = 1;
    const monthlyVolume = 500_000;

    if (monthlyVolume + amount > this.KYC_THRESHOLD_XOF && userKycLevel < 2) {
      throw new Error('KYC Level 2 required for payouts exceeding 1,000,000 XOF/month');
    }

    return true;
  }
}
