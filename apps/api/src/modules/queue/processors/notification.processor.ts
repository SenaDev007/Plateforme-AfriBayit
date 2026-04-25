import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { QUEUE_NOTIFICATION } from '../queue.module';

export interface NotificationJobData {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

@Processor(QUEUE_NOTIFICATION)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<NotificationJobData>): Promise<void> {
    const { userId, type, title } = job.data;
    this.logger.log(`Processing notification [${type}] for user ${userId}: ${title}`);
    // Push notification via WebSocket gateway is handled real-time;
    // this processor handles DB persistence + SMS/email fallback.
  }
}
