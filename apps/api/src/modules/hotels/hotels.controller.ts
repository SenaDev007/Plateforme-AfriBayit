import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Version,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HotelsService } from './hotels.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';
import { compactQuery } from '../../common/utils/query';

@ApiTags('Hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: "Recherche d'hôtels avec filtres" })
  search(
    @Query('city') city?: string,
    @Query('type') type?: string,
    @Query('starRating', new DefaultValuePipe(0), ParseIntPipe) starRating?: number,
    @Query('minPrice', new DefaultValuePipe(0), ParseIntPipe) minPrice?: number,
    @Query('maxPrice', new DefaultValuePipe(0), ParseIntPipe) maxPrice?: number,
    @Query('checkIn') checkIn?: string,
    @Query('checkOut') checkOut?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit?: number,
  ) {
    return this.hotelsService.search(
      compactQuery({
        city,
        type,
        starRating: starRating || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        checkIn,
        checkOut,
        page,
        limit,
      }),
    );
  }

  @Get('my-bookings')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes réservations hôtelières' })
  getMyBookings(@CurrentUser() user: User) {
    return this.hotelsService.getMyBookings(user.id);
  }

  @Get(':slug')
  @Version('1')
  @ApiOperation({ summary: "Détail d'un hôtel par slug" })
  findBySlug(@Param('slug') slug: string) {
    return this.hotelsService.findBySlug(slug);
  }

  @Get(':id/availability')
  @Version('1')
  @ApiOperation({ summary: 'Disponibilité des chambres pour des dates' })
  checkAvailability(
    @Param('id') id: string,
    @Query('checkIn') checkIn: string,
    @Query('checkOut') checkOut: string,
  ) {
    return this.hotelsService.checkAvailability(id, checkIn, checkOut);
  }

  @Post()
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un hôtel (propriétaire/admin)' })
  create(@Body() body: Parameters<HotelsService['create']>[0], @CurrentUser() user: User) {
    return this.hotelsService.create(body, user.id);
  }

  @Post('rooms')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter une chambre à un hôtel' })
  createRoom(@Body() body: Parameters<HotelsService['createRoom']>[0]) {
    return this.hotelsService.createRoom(body);
  }

  @Post(':id/book')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Réserver une chambre' })
  book(
    @Param('id') hotelId: string,
    @Body()
    body: { roomId: string; checkIn: string; checkOut: string; guests: number; notes?: string },
    @CurrentUser() user: User,
  ) {
    return this.hotelsService.book({ hotelId, ...body, userId: user.id });
  }
}
