import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailService } from './channels/email.service';
import { SmsService } from './channels/sms.service';
import { WhatsAppService } from './channels/whatsapp.service';
import { GatewaysModule } from '../../gateways/gateways.module';

@Module({
  imports: [GatewaysModule, ConfigModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService, SmsService, WhatsAppService],
  exports: [NotificationsService, EmailService, WhatsAppService],
})
export class NotificationsModule {}
