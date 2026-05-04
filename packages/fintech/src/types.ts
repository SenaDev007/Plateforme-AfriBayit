/**
 * Section 7B.1 - Format interne canonique WebhookEvent
 */

export type PaymentProvider = 'fedapay' | 'stripe' | 'flutterwave';
export type WebhookStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
export type Currency = 'XOF' | 'EUR' | 'USD' | 'NGN' | 'GHS' | 'KES';

export interface WebhookEvent {
  eventId: string; // uuid
  provider: PaymentProvider;
  status: WebhookStatus;
  transactionId: string;
  amount: number;
  currency: Currency;
  metadata: {
    userId?: string;
    orderId?: string;
    escrowId?: string;
    propertyId?: string;
  };
  timestamp: string; // ISO8601
  rawPayload: any;
}

/**
 * Section 7B.3.1 - États Transactionnels (FSM)
 */
export type TransactionState =
  | 'CREATED'
  | 'FUNDED'
  | 'IN_PROGRESS'
  | 'VALIDATION'
  | 'RELEASED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'EXPIRED';

/**
 * Section 7B.4.1 - Structure des Wallets
 */
export interface WalletMetrics {
  balance_available: number;
  balance_escrow_held: number;
  balance_pending_payout: number;
  total_transacted_lifetime: number;
  currency: Currency;
}
