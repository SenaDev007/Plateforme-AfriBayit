import { Module } from '@nestjs/common';
import { ArtisansService } from './artisans.service';
import { ArtisansController } from './artisans.controller';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [ArtisansService],
  controllers: [ArtisansController],
  exports: [ArtisansService],
})
export class ArtisansModule {}
