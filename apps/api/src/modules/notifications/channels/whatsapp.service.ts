import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface TextMessagePayload {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'text';
  text: { preview_url: boolean; body: string };
}

interface TemplateMessagePayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: { code: string };
    components?: { type: string; parameters: { type: string; text?: string }[] }[];
  };
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly token: string | null;
  private readonly phoneNumberId: string | null;
  private readonly apiUrl: string;

  constructor(private readonly config: ConfigService) {
    this.token = config.get<string>('WHATSAPP_TOKEN') ?? null;
    this.phoneNumberId = config.get<string>('WHATSAPP_PHONE_NUMBER_ID') ?? null;
    this.apiUrl = `https://graph.facebook.com/v21.0/${this.phoneNumberId ?? ''}/messages`;
  }

  get isEnabled(): boolean {
    return !!this.token && !!this.phoneNumberId;
  }

  /** Send a plain text message (valid within a 24h customer-initiated window) */
  async sendText(phone: string, message: string): Promise<void> {
    if (!this.isEnabled) return;
    const payload: TextMessagePayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: this.normalizePhone(phone),
      type: 'text',
      text: { preview_url: false, body: message },
    };
    await this.send(payload);
  }

  /** Send a pre-approved template message (works outside the 24h window) */
  async sendTemplate(
    phone: string,
    templateName: string,
    params: string[],
    languageCode = 'fr',
  ): Promise<void> {
    if (!this.isEnabled) return;
    const payload: TemplateMessagePayload = {
      messaging_product: 'whatsapp',
      to: this.normalizePhone(phone),
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        ...(params.length > 0
          ? {
              components: [
                {
                  type: 'body',
                  parameters: params.map((p) => ({ type: 'text', text: p })),
                },
              ],
            }
          : {}),
      },
    };
    await this.send(payload);
  }

  // ── Typed notification helpers ─────────────────────────────────────────────

  async notifyTransactionUpdate(
    phone: string,
    params: {
      recipientName: string;
      transactionRef: string;
      status: string;
      amount: string;
      currency: string;
    },
  ): Promise<void> {
    const statusLabels: Record<string, string> = {
      FUNDED: 'financée ✅',
      VALIDATED: 'validée ✅',
      RELEASED: 'fonds libérés 💰',
      COMPLETED: 'terminée ✅',
      DISPUTED: 'en litige ⚠️',
      REFUNDED: 'remboursée 🔄',
    };
    const label = statusLabels[params.status] ?? params.status;

    await this.sendText(
      phone,
      `🏠 *AfriBayit* — Transaction ${params.transactionRef}\n\nBonjour ${params.recipientName},\n\nVotre transaction a été *${label}*.\nMontant : *${params.amount} ${params.currency}*\n\n👉 https://afribayit.com/dashboard/transactions`,
    );
  }

  async notifyKycStatus(
    phone: string,
    params: {
      recipientName: string;
      status: 'APPROVED' | 'REJECTED';
      documentType: string;
      reviewNote?: string;
    },
  ): Promise<void> {
    const approved = params.status === 'APPROVED';
    const body = approved
      ? `✅ *AfriBayit KYC*\n\nBonjour ${params.recipientName},\n\nVotre document (*${params.documentType}*) a été *approuvé* ! Votre niveau de vérification a été mis à jour.\n\n👉 https://afribayit.com/dashboard/profil`
      : `❌ *AfriBayit KYC*\n\nBonjour ${params.recipientName},\n\nVotre document (*${params.documentType}*) a été *rejeté*.${params.reviewNote ? `\n\nMotif : ${params.reviewNote}` : ''}\n\nVeuillez soumettre un nouveau document.\n👉 https://afribayit.com/dashboard/profil`;

    await this.sendText(phone, body);
  }

  async notifyPayoutStatus(
    phone: string,
    params: {
      recipientName: string;
      amount: string;
      currency: string;
      status: 'COMPLETED' | 'FAILED';
      operator?: string;
      failureReason?: string;
    },
  ): Promise<void> {
    const body =
      params.status === 'COMPLETED'
        ? `💰 *AfriBayit Virement*\n\nBonjour ${params.recipientName},\n\nVotre virement de *${params.amount} ${params.currency}*${params.operator ? ` via ${params.operator.toUpperCase()}` : ''} a été *effectué avec succès* !\n\nMerci d'utiliser AfriBayit.`
        : `⚠️ *AfriBayit Virement*\n\nBonjour ${params.recipientName},\n\nVotre virement de *${params.amount} ${params.currency}* a *échoué*.${params.failureReason ? `\n\nRaison : ${params.failureReason}` : ''}\n\nContactez le support : support@afribayit.com`;

    await this.sendText(phone, body);
  }

  async notifyNewMessage(
    phone: string,
    params: {
      recipientName: string;
      senderName: string;
      preview: string;
    },
  ): Promise<void> {
    await this.sendText(
      phone,
      `💬 *AfriBayit Message*\n\nBonjour ${params.recipientName},\n\n*${params.senderName}* vous a envoyé un message :\n_"${params.preview.slice(0, 100)}${params.preview.length > 100 ? '…' : ''}"_\n\n👉 https://afribayit.com/dashboard/messages`,
    );
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  private async send(payload: TextMessagePayload | TemplateMessagePayload): Promise<void> {
    try {
      await axios.post(this.apiUrl, payload, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10_000,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`WhatsApp send failed to ${payload.to}: ${msg}`);
    }
  }

  private normalizePhone(phone: string): string {
    // Strip spaces and dashes; ensure E.164 format
    const cleaned = phone.replace(/[\s\-().]/g, '');
    return cleaned.startsWith('+') ? cleaned : `+${cleaned}`;
  }
}
