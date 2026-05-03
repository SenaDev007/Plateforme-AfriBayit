import { Module } from '@nestjs/common';
import { GeoTrustController } from './geotrust.controller';
import { GeoTrustService } from './geotrust.service';
import { BlockchainAnchorService } from './blockchain.service';

@Module({
  controllers: [GeoTrustController],
  providers: [GeoTrustService, BlockchainAnchorService],
  exports: [GeoTrustService, BlockchainAnchorService],
})
export class GeoTrustModule {}
