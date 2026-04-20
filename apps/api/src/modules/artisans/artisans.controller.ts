import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe, ParseBoolPipe,
  ParseFloatPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ArtisansService } from './artisans.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Artisans')
@Controller('artisans')
export class ArtisansController {
  constructor(private readonly artisansService: ArtisansService) {}

  @Get()
  @ApiOperation({ summary: 'Recherche d\'artisans avec filtres' })
  search(
    @Query('ville') ville?: string,
    @Query('categorie') categorie?: string,
    @Query('noteMin', new DefaultValuePipe(0), ParseFloatPipe) noteMin?: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit?: number,
  ) {
    return this.artisansService.search({ ville, categorie, noteMin: noteMin || undefined, page, limit });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Profil d\'un artisan par slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.artisansService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un profil artisan' })
  createProfile(
    @Body() body: Parameters<typeof this.artisansService.createProfile>[0],
    @CurrentUser() user: { id: string },
  ) {
    return this.artisansService.createProfile(body, user.id);
  }

  @Post('services')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un service à un profil artisan' })
  addService(@Body() body: Parameters<typeof this.artisansService.addService>[0]) {
    return this.artisansService.addService(body);
  }

  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Laisser un avis sur un artisan' })
  addReview(
    @Body() body: Parameters<typeof this.artisansService.addReview>[0],
    @CurrentUser() user: { id: string },
  ) {
    return this.artisansService.addReview(body, user.id);
  }

  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Basculer la disponibilité' })
  toggleAvailability(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.artisansService.toggleAvailability(id, user.id);
  }
}
