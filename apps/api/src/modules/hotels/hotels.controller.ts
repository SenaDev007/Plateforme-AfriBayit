import {
  Controller, Get, Post, Param, Body, Query,
  UseGuards, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  @ApiOperation({ summary: 'Recherche d\'hôtels avec filtres' })
  search(
    @Query('ville') ville?: string,
    @Query('type') type?: string,
    @Query('stars', new DefaultValuePipe(0), ParseIntPipe) stars?: number,
    @Query('prixMin', new DefaultValuePipe(0), ParseIntPipe) prixMin?: number,
    @Query('prixMax', new DefaultValuePipe(0), ParseIntPipe) prixMax?: number,
    @Query('checkin') checkin?: string,
    @Query('checkout') checkout?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit?: number,
  ) {
    return this.hotelsService.search({ ville, type, stars: stars || undefined, prixMin: prixMin || undefined, prixMax: prixMax || undefined, checkin, checkout, page, limit });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Détail d\'un hôtel par slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.hotelsService.findBySlug(slug);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Disponibilité des chambres pour des dates' })
  checkAvailability(
    @Param('id') id: string,
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string,
  ) {
    return this.hotelsService.checkAvailability(id, checkin, checkout);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un hôtel (propriétaire/admin)' })
  create(@Body() body: Record<string, unknown>, @CurrentUser() user: { id: string }) {
    return this.hotelsService.create(body as Parameters<typeof this.hotelsService.create>[0], user.id);
  }

  @Post('rooms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter une chambre à un hôtel' })
  createRoom(@Body() body: Parameters<typeof this.hotelsService.createRoom>[0]) {
    return this.hotelsService.createRoom(body);
  }

  @Post(':id/book')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Réserver une chambre' })
  book(
    @Param('id') hotelId: string,
    @Body() body: { roomId: string; checkin: string; checkout: string; guestCount: number },
    @CurrentUser() user: { id: string },
  ) {
    return this.hotelsService.book({ hotelId, ...body, guestId: user.id });
  }
}
