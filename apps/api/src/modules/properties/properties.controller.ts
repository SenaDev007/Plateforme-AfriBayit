import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { compactQuery } from '../../common/utils/query';
import type { User, PropertyType, PropertyPurpose, Country } from '@afribayit/db';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Rechercher des propriétés' })
  search(
    @Query('q') q?: string,
    @Query('city') city?: string,
    @Query('purpose') purpose?: PropertyPurpose,
    @Query('type') type?: PropertyType,
    @Query('prixMin') prixMin?: number,
    @Query('prixMax') prixMax?: number,
    @Query('country') country?: Country,
    @Query('page') page = 1,
    @Query('limit') limit = 12,
  ) {
    return this.propertiesService.search(
      compactQuery({ q, city, purpose, type, prixMin, prixMax, country, page, limit }),
    );
  }

  @Get(':slug')
  @Version('1')
  @ApiOperation({ summary: 'Détail propriété par slug' })
  findOne(@Param('slug') slug: string) {
    return this.propertiesService.findBySlug(slug);
  }

  @Post()
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une annonce' })
  create(@CurrentUser() user: User, @Body() body: Parameters<PropertiesService['create']>[1]) {
    return this.propertiesService.create(user.id, body);
  }

  @Patch(':slug')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une annonce' })
  update(
    @Param('slug') slug: string,
    @CurrentUser() user: User,
    @Body() body: Parameters<PropertiesService['update']>[2],
  ) {
    return this.propertiesService.update(slug, user.id, body);
  }

  @Post(':slug/publish')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publier une annonce' })
  publish(@Param('slug') slug: string, @CurrentUser() user: User) {
    return this.propertiesService.publish(slug, user.id);
  }

  @Post('upload/presign')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir une URL pré-signée pour upload image' })
  presign(@Body() body: { contentType: string; folder?: string }) {
    return this.storageService.getPresignedUploadUrl({
      folder: body.folder ?? 'properties',
      contentType: body.contentType,
    });
  }
}
