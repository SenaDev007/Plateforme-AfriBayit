import { Module } from '@nestjs/common';
import { RebeccaService } from './rebecca.service';
import { AiController } from './ai.controller';

@Module({
  providers: [RebeccaService],
  controllers: [AiController],
  exports: [RebeccaService],
})
export class AiModule {}
