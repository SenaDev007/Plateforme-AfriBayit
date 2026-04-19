import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { StorageService } from './storage.service';

@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService, StorageService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
