import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchResolver } from './search.resolver';

@Module({
  controllers: [SearchController],
  providers: [SearchService, SearchResolver],
  exports: [SearchService],
})
export class SearchModule {}
