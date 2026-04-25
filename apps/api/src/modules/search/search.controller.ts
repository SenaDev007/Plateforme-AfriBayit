import { Controller, Get, Query, Version } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { compactQuery } from '../../common/utils/query';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Recherche full-text Elasticsearch' })
  search(
    @Query('q') q?: string,
    @Query('city') city?: string,
    @Query('purpose') purpose?: string,
    @Query('type') type?: string,
    @Query('prixMin') prixMin?: number,
    @Query('prixMax') prixMax?: number,
    @Query('lat') lat?: number,
    @Query('lon') lon?: number,
    @Query('radius') radiusKm?: number,
    @Query('from') from = 0,
    @Query('size') size = 12,
  ) {
    return this.searchService.search(
      compactQuery({ q, city, purpose, type, prixMin, prixMax, lat, lon, radiusKm, from, size }),
    );
  }
}
