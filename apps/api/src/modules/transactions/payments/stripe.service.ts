import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(private readonly config: ConfigService) {
    this.stripe = new Stripe(config.getOrThrow<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-02-24.acacia',
    });
    this.webhookSecret = config.getOrThrow<string>('STRIPE_WEBHOOK_SECRET');
  }

  /** Create a Stripe Payment Intent for card payments */
  async createPaymentIntent(params: {
    amount: number;
    currency: string;
    description: string;
    reference: string;
    customerEmail?: string;
  }): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      const intent = await this.stripe.paymentIntents.create({
        amount: params.amount, // In smallest currency unit (cents/francs)
        currency: params.currency.toLowerCase(),
        description: params.description,
        ...(params.customerEmail ? { receipt_email: params.customerEmail } : {}),
        metadata: { reference: params.reference },
        automatic_payment_methods: { enabled: true },
      });

      return {
        clientSecret: intent.client_secret ?? '',
        paymentIntentId: intent.id,
      };
    } catch (error) {
      this.logger.error('Stripe PaymentIntent creation failed', error);
      throw new BadRequestException("Impossible d'initier le paiement par carte.");
    }
  }

  /** Retrieve client_secret for an existing PaymentIntent (for frontend re-render) */
  async getClientSecret(paymentIntentId: string): Promise<string> {
    const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
    return intent.client_secret ?? '';
  }

  /** Construct and verify a Stripe webhook event */
  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    return this.stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
  }
}
