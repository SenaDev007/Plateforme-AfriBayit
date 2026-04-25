import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { EmailService } from './channels/email.service';
import { SmsService } from './channels/sms.service';
import { GatewaysModule } from '../../gateways/gateways.module';

@Module({
  imports: [GatewaysModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailService, SmsService],
  exports: [NotificationsService, EmailService],
})
export class NotificationsModule {}
