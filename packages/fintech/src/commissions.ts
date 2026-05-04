/**
 * Section 6.2 - Structure des Commissions AfriBayit
 */

export type TransactionType =
  | 'SALE'
  | 'RENT_LONG'
  | 'RENT_SHORT_HOST'
  | 'RENT_SHORT_GUEST'
  | 'GUESTHOUSE_HOST'
  | 'GUESTHOUSE_GUEST'
  | 'ARTISAN'
  | 'GEOMETER'
  | 'HOTEL';

export interface CommissionResult {
  sellerFee: number;
  buyerFee: number;
  totalFee: number;
  mode: 'DEDUCTED_POST' | 'DEDUCTED_PRE' | 'ADDED_PRE' | 'PMS_AUTO';
}

export function calculateCommission(type: TransactionType, amount: number): CommissionResult {
  switch (type) {
    case 'SALE':
      // 2-5% du prix (selon montant)
      const saleRate = amount > 100_000_000 ? 0.02 : 0.05;
      return {
        sellerFee: amount * saleRate,
        buyerFee: 0,
        totalFee: amount * saleRate,
        mode: 'DEDUCTED_POST',
      };

    case 'RENT_LONG':
      // Équivalent 1 mois de loyer vendeur, 0.5 mois acheteur
      return {
        sellerFee: amount, // Loyer mensuel
        buyerFee: amount * 0.5,
        totalFee: amount * 1.5,
        mode: 'DEDUCTED_PRE',
      };

    case 'RENT_SHORT_HOST':
      // 3% hôte
      return {
        sellerFee: amount * 0.03,
        buyerFee: 0,
        totalFee: amount * 0.03,
        mode: 'DEDUCTED_POST',
      };

    case 'RENT_SHORT_GUEST':
      // 10-12% frais service voyageur
      return {
        sellerFee: 0,
        buyerFee: amount * 0.12,
        totalFee: amount * 0.12,
        mode: 'ADDED_PRE',
      };

    case 'GUESTHOUSE_HOST':
      // 3% par réservation chambre
      return {
        sellerFee: amount * 0.03,
        buyerFee: 0,
        totalFee: amount * 0.03,
        mode: 'PMS_AUTO',
      };

    case 'GUESTHOUSE_GUEST':
      // 10-13% frais de service voyageur
      return {
        sellerFee: 0,
        buyerFee: amount * 0.13,
        totalFee: amount * 0.13,
        mode: 'ADDED_PRE',
      };

    case 'ARTISAN':
    case 'GEOMETER':
      // 8-12% de la mission
      return {
        sellerFee: amount * 0.1, // Moyenne 10%
        buyerFee: 0,
        totalFee: amount * 0.1,
        mode: 'DEDUCTED_POST',
      };

    case 'HOTEL':
      // 12-15% du montant nuit
      return {
        sellerFee: amount * 0.15,
        buyerFee: 0,
        totalFee: amount * 0.15,
        mode: 'DEDUCTED_POST',
      };

    default:
      return { sellerFee: 0, buyerFee: 0, totalFee: 0, mode: 'DEDUCTED_POST' };
  }
}
