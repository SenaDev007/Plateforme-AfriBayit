import { Module } from '@nestjs/common';
import { GeoTrustService } from './geotrust.service';
import { GeoTrustController } from './geotrust.controller';

@Module({
  providers: [GeoTrustService],
  controllers: [GeoTrustController],
  exports: [GeoTrustService],
})
export class GeoTrustModule {}
