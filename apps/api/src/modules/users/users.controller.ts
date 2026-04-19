import { Controller, Get, Patch, Post, Delete, Body, Param, UseGuards, Version } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @Version('1')
  @ApiOperation({ summary: 'Mon profil complet' })
  me(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @Version('1')
  @ApiOperation({ summary: 'Mettre à jour mon profil' })
  updateProfile(@CurrentUser() user: User, @Body() body: Parameters<UsersService['updateProfile']>[1]) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Post('me/kyc')
  @Version('1')
  @ApiOperation({ summary: 'Soumettre un document KYC' })
  submitKyc(@CurrentUser() user: User, @Body() body: Parameters<UsersService['submitKycDocument']>[1]) {
    return this.usersService.submitKycDocument(user.id, body);
  }

  @Get('me/favorites')
  @Version('1')
  @ApiOperation({ summary: 'Mes favoris' })
  favorites(@CurrentUser() user: User) {
    return this.usersService.getFavorites(user.id);
  }

  @Post('me/favorites/:propertyId')
  @Version('1')
  @ApiOperation({ summary: 'Ajouter/Retirer un favori' })
  toggleFavorite(@CurrentUser() user: User, @Param('propertyId') propertyId: string) {
    return this.usersService.toggleFavorite(user.id, propertyId);
  }
}
