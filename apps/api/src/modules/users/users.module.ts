import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DocumentAIService } from './document-ai.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ConfigModule, NotificationsModule],
  controllers: [UsersController],
  providers: [UsersService, DocumentAIService],
  exports: [UsersService],
})
export class UsersModule {}
