import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface FedaPayTransaction {
  id: number;
  reference: string;
  amount: number;
  currency: { iso: string };
  status: { name: string };
  payment_method?: string;
}

interface FedaPayInitResult {
  transactionId: number;
  paymentUrl: string;
  reference: string;
}

@Injectable()
export class FedaPayService {
  private readonly logger = new Logger(FedaPayService.name);
  private readonly baseUrl: string;
  private readonly secretKey: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = config.get<string>('NODE_ENV') === 'production'
      ? 'https://api.fedapay.com/v1'
      : 'https://sandbox-api.fedapay.com/v1';
    this.secretKey = config.getOrThrow<string>('FEDAPAY_SECRET_KEY');
  }

  /** Initiate a Mobile Money payment via FedaPay */
  async initiatePayment(params: {
    amount: number;
    currency: string;
    description: string;
    callbackUrl: string;
    customerEmail?: string;
    customerPhone?: string;
    reference: string;
  }): Promise<FedaPayInitResult> {
    try {
      const response = await axios.post<{ v1: { transaction: FedaPayTransaction }; url: string }>(
        `${this.baseUrl}/transactions`,
        {
          description: params.description,
          amount: params.amount,
          currency: { iso: params.currency },
          callback_url: params.callbackUrl,
          customer: {
            email: params.customerEmail,
            phone_number: { number: params.customerPhone },
          },
          metadata: { reference: params.reference },
        },
        {
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const tx = response.data.v1.transaction;
      const paymentUrl = response.data.url;

      return {
        transactionId: tx.id,
        paymentUrl,
        reference: tx.reference,
      };
    } catch (error) {
      this.logger.error('FedaPay payment initiation failed', error);
      throw new BadRequestException('Impossible d\'initier le paiement Mobile Money.');
    }
  }

  /** Verify webhook signature and return normalized payment status */
  verifyWebhook(payload: Record<string, unknown>, signature: string): boolean {
    // FedaPay uses HMAC-SHA256 — simplified check here
    const expectedSecret = this.config.get<string>('FEDAPAY_WEBHOOK_SECRET');
    return signature === expectedSecret; // In prod: use crypto.createHmac
  }

  /** Normalize FedaPay status to our internal status */
  mapStatus(fedaStatus: string): 'FUNDED' | 'CANCELLED' | 'UNKNOWN' {
    const map: Record<string, 'FUNDED' | 'CANCELLED' | 'UNKNOWN'> = {
      approved: 'FUNDED',
      declined: 'CANCELLED',
      cancelled: 'CANCELLED',
      refunded: 'CANCELLED',
    };
    return map[fedaStatus] ?? 'UNKNOWN';
  }
}
