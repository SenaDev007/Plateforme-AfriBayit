import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DocumentAIService } from './document-ai.service';

@Module({
  imports: [ConfigModule],
  controllers: [UsersController],
  providers: [UsersService, DocumentAIService],
  exports: [UsersService],
})
export class UsersModule {}
