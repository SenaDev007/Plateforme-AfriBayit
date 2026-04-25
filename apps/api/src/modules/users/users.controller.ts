import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Version,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';
import { UserRole } from '@afribayit/db';

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
  updateProfile(
    @CurrentUser() user: User,
    @Body() body: Parameters<UsersService['updateProfile']>[1],
  ) {
    return this.usersService.updateProfile(user.id, body);
  }

  @Post('me/kyc')
  @Version('1')
  @ApiOperation({ summary: 'Soumettre un document KYC' })
  submitKyc(
    @CurrentUser() user: User,
    @Body() body: Parameters<UsersService['submitKycDocument']>[1],
  ) {
    return this.usersService.submitKycDocument(user.id, body);
  }

  @Get('me/data-export')
  @Version('1')
  @ApiOperation({ summary: 'Exporter mes données personnelles (RGPD)' })
  exportMyData(@CurrentUser() user: User) {
    return this.usersService.exportMyData(user.id);
  }

  @Delete('me')
  @Version('1')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Supprimer mon compte (RGPD — droit à l'effacement)" })
  async deleteMyAccount(@CurrentUser() user: User) {
    await this.usersService.deleteMyAccount(user.id);
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

  // --- Admin Endpoints ---

  @Get('admin/kyc/pending')
  @Version('1')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Lister les documents KYC en attente (Admin)' })
  getPendingKyc() {
    return this.usersService.findPendingKycDocuments();
  }

  @Patch('admin/kyc/review/:id')
  @Version('1')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Réviser un document KYC (Admin)' })
  reviewKyc(
    @Param('id') id: string,
    @CurrentUser() admin: User,
    @Body() body: { status: 'APPROVED' | 'REJECTED'; note: string },
  ) {
    return this.usersService.reviewKycDocument(id, body.status, body.note, admin.id);
  }

  @Get('admin/users')
  @Version('1')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Lister tous les utilisateurs (Admin)' })
  getAdminUsers(@Query() query: any) {
    return this.usersService.findAllUsers(query);
  }

  @Patch('admin/users/:id/role')
  @Version('1')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Modifier le rôle d'un utilisateur (Admin)" })
  updateUserRole(@Param('id') id: string, @Body() body: { role: UserRole }) {
    return this.usersService.updateUserRole(id, body.role);
  }

  @Patch('admin/users/:id/status')
  @Version('1')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Modifier le statut d'un utilisateur (Admin)" })
  updateUserStatus(@Param('id') id: string, @Body() body: { status: 'ACTIVE' | 'BANNED' }) {
    return this.usersService.updateUserStatus(id, body.status);
  }
}
