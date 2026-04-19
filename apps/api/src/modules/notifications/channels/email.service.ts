import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

interface EmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(config.getOrThrow<string>('RESEND_API_KEY'));
    this.fromEmail = config.get<string>('FROM_EMAIL', 'noreply@afribayit.com');
  }

  async send(params: EmailParams): Promise<void> {
    try {
      await this.resend.emails.send({
        from: params.from ?? this.fromEmail,
        to: Array.isArray(params.to) ? params.to : [params.to],
        subject: params.subject,
        html: params.html,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${params.to.toString()}`, error);
    }
  }

  /** Send transaction status notification */
  async sendTransactionUpdate(params: {
    to: string;
    recipientName: string;
    transactionRef: string;
    status: string;
    amount: string;
  }): Promise<void> {
    await this.send({
      to: params.to,
      subject: `Transaction ${params.transactionRef} — Mise à jour`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #003087; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Afri<span style="color: #D4AF37;">Bayit</span></h1>
          </div>
          <div style="padding: 32px;">
            <p>Bonjour ${params.recipientName},</p>
            <p>Votre transaction <strong>${params.transactionRef}</strong> a été mise à jour :</p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              <p style="margin: 0;"><strong>Statut :</strong> ${params.status}</p>
              <p style="margin: 8px 0 0;"><strong>Montant :</strong> ${params.amount}</p>
            </div>
            <a href="https://afribayit.com/dashboard/transactions" style="background: #003087; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; display: inline-block;">
              Voir la transaction
            </a>
          </div>
        </div>
      `,
    });
  }
}
