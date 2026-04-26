import {
  Controller,
  Post,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Version,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';

class RefreshDto {
  @ApiProperty()
  @IsString()
  refreshToken!: string;
}

class ForgotPasswordDto {
  @ApiProperty({ example: 'aminata@example.com' })
  @IsEmail()
  email!: string;
}

class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Au moins une majuscule requise' })
  @Matches(/[0-9]/, { message: 'Au moins un chiffre requis' })
  newPassword!: string;
}

class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  oldPassword!: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  @Matches(/[A-Z]/, { message: 'Au moins une majuscule requise' })
  @Matches(/[0-9]/, { message: 'Au moins un chiffre requis' })
  newPassword!: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Version('1')
  @ApiOperation({ summary: 'Créer un compte' })
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion' })
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renouveler les tokens via le refresh token' })
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshTokens(dto.refreshToken);
  }

  @Post('logout')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Déconnexion — invalide le token courant' })
  async logout(@Headers('authorization') auth: string) {
    const token = auth?.replace(/^Bearer\s+/i, '') ?? '';
    await this.authService.logout(token);
    return { message: 'Déconnecté avec succès.' };
  }

  @Get('me')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil utilisateur courant' })
  me(@CurrentUser() user: User) {
    const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user;
    return safeUser;
  }

  @Patch('change-password')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Changer le mot de passe (connecté)' })
  async changePassword(@CurrentUser() user: User, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(user.id, dto.oldPassword, dto.newPassword);
    return { message: 'Mot de passe mis à jour.' };
  }

  @Post('forgot-password')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demande de réinitialisation du mot de passe' })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.forgotPassword(dto.email);
    return { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' };
  }

  @Post('reset-password')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Réinitialiser le mot de passe avec le token reçu par email' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto.token, dto.newPassword);
    return { message: 'Mot de passe réinitialisé avec succès.' };
  }

  @Post('verify-email')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Vérifier l'adresse email via token" })
  async verifyEmail(@Body() body: { token: string }) {
    await this.authService.verifyEmail(body.token);
    return { message: 'Email vérifié avec succès.' };
  }

  @Post('resend-verification')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Renvoyer l'email de vérification" })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async resendVerification(@CurrentUser() user: User) {
    await this.authService.sendVerificationEmail(user.id, user.email, user.firstName);
    return { message: 'Email de vérification renvoyé.' };
  }

  @Post('magic-link/send')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envoyer un lien de connexion magique par email' })
  @Throttle({ default: { limit: 3, ttl: 60_000 } })
  async sendMagicLink(@Body() dto: ForgotPasswordDto) {
    await this.authService.sendMagicLink(dto.email);
    return { message: 'Si cet email existe, un lien de connexion a été envoyé.' };
  }

  @Post('magic-link/verify')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vérifier un lien magique et obtenir des tokens' })
  async verifyMagicLink(@Body() body: { token: string }) {
    return this.authService.verifyMagicLink(body.token);
  }

  @Post('2fa/setup')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialiser le 2FA (TOTP)' })
  async setup2FA(@CurrentUser() user: User) {
    return this.authService.setup2FA(user.id);
  }

  @Post('2fa/verify')
  @Version('1')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activer le 2FA avec code TOTP' })
  async verify2FA(@CurrentUser() user: User, @Body() body: { token: string }) {
    await this.authService.verify2FA(user.id, body.token);
    return { message: '2FA activé avec succès.' };
  }
}
