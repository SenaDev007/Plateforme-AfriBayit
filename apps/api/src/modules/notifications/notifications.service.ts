import { Injectable, Inject } from '@nestjs/common';
import type { PrismaClient, NotificationType } from '@afribayit/db';
import { EmailService } from './channels/email.service';
import { SmsService } from './channels/sms.service';

interface CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sendEmail?: boolean;
  sendSms?: boolean;
  email?: string;
  phone?: string;
}

@Injectable()
export class NotificationsService {
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  /** Create in-app notification + optionally send email/SMS */
  async create(dto: CreateNotificationDto): Promise<void> {
    await this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        title: dto.title,
        body: dto.body,
        data: dto.data,
      },
    });

    if (dto.sendEmail && dto.email) {
      await this.emailService.send({
        to: dto.email,
        subject: dto.title,
        html: `<p>${dto.body}</p>`,
      });
    }

    if (dto.sendSms && dto.phone) {
      await this.smsService.send(dto.phone, `AfriBayit: ${dto.body}`);
    }
  }

  /** Get unread notifications for a user */
  async getForUser(userId: string, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /** Mark notification as read */
  async markRead(id: string, userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /** Mark all as read */
  async markAllRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }
}
