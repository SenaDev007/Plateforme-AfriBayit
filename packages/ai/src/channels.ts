/**
 * Section 8.2.3 — WhatsApp Business API Adapter
 * Même agent backend Rebecca — format adapté (pas de markdown, messages courts)
 */
export class WhatsAppAdapter {
  private readonly apiUrl: string;
  private readonly token: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0';
    this.token = process.env.WHATSAPP_TOKEN || '';
  }

  /**
   * Format Rebecca's response for WhatsApp (no markdown, short messages, reply buttons)
   */
  formatForWhatsApp(text: string): {
    type: 'text' | 'interactive';
    body: string;
    buttons?: { id: string; title: string }[];
  } {
    // Strip markdown
    const clean = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/#{1,3} /g, '')
      .substring(0, 1024);

    // Detect if response warrants quick reply buttons
    const hasProperties = text.includes('propriété') || text.includes('terrain');
    const buttons = hasProperties
      ? [
          { id: 'view_listings', title: 'Voir les annonces' },
          { id: 'contact_agent', title: 'Contacter un agent' },
        ]
      : undefined;

    return {
      type: buttons ? 'interactive' : 'text',
      body: clean,
      buttons,
    };
  }

  /**
   * Send message via Meta Cloud API (Section 8.2.3)
   */
  async sendMessage(to: string, rebeccaResponse: string) {
    const payload = this.formatForWhatsApp(rebeccaResponse);

    // Production: POST to WhatsApp Cloud API
    // await fetch(`${this.apiUrl}/${process.env.PHONE_NUMBER_ID}/messages`, {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload })
    // })

    console.log(`[WhatsApp] Sent to ${to}:`, payload);
    return { success: true, to, payload };
  }

  /**
   * Parse incoming WhatsApp webhook (Section 8.2.3)
   */
  parseIncomingWebhook(body: any): {
    from: string;
    message: string;
    type: 'text' | 'button_reply';
  } | null {
    try {
      const entry = body?.entry?.[0]?.changes?.[0]?.value;
      const msg = entry?.messages?.[0];
      if (!msg) return null;

      return {
        from: msg.from,
        message: msg.text?.body || msg.interactive?.button_reply?.id || '',
        type: msg.type === 'interactive' ? 'button_reply' : 'text',
      };
    } catch {
      return null;
    }
  }
}

/**
 * Section 8.2.3 — Africa's Talking SMS Fallback
 * Version texte uniquement pour zones sans WhatsApp
 */
export class SMSFallbackAdapter {
  async sendSMS(to: string, message: string): Promise<{ success: boolean }> {
    // Strip to plain text, max 160 chars per SMS
    const smsText = message.replace(/[^\w\s.,!?àâéèêîôùûçœæ]/gi, '').substring(0, 160);

    // Production: Africa's Talking API
    // const AT = require('africastalking')({ apiKey: process.env.AT_API_KEY, username: process.env.AT_USERNAME });
    // await AT.SMS.send({ to: [to], message: smsText, from: 'AfriBayit' });

    console.log(`[SMS Fallback] To: ${to} | Message: ${smsText}`);
    return { success: true };
  }
}
