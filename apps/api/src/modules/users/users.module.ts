import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DocumentAIService } from './document-ai.service';
import { AmbassadorController } from './ambassador.controller';
import { AmbassadorService } from './ambassador.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [ConfigModule, NotificationsModule],
  controllers: [UsersController, AmbassadorController],
  providers: [UsersService, DocumentAIService, AmbassadorService],
  exports: [UsersService, AmbassadorService],
})
export class UsersModule {}
