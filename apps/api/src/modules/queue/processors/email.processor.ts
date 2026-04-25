import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Resend } from 'resend';
import { QUEUE_EMAIL } from '../queue.module';

export interface EmailJobData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

@Processor(QUEUE_EMAIL)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);
  private readonly resend = new Resend(process.env['RESEND_API_KEY']);

  async process(job: Job<EmailJobData>): Promise<void> {
    const { to, subject, html, from } = job.data;
    try {
      await this.resend.emails.send({
        from: from ?? 'AfriBayit <noreply@afribayit.com>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });
      this.logger.log(`Email sent: ${subject} → ${to}`);
    } catch (err) {
      this.logger.error(`Email failed [${job.id}]: ${(err as Error).message}`);
      throw err;
    }
  }
}
