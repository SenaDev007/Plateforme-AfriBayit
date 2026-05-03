import { Module } from '@nestjs/common';
import { NotaryService } from './notary.service';
// import { NotaryController } from './notary.controller';

@Module({
  providers: [NotaryService],
  // controllers: [NotaryController],
  exports: [NotaryService],
})
export class NotaryModule {}
