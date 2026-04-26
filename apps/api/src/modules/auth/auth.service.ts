import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { randomUUID, randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import type { Cache } from 'cache-manager';
import type { PrismaClient, User } from '@afribayit/db';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import { JwtBlacklistService } from '../security/jwt-blacklist.service';
import { EmailService } from '../notifications/channels/email.service';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  jti: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'passwordHash' | 'twoFactorSecret'>;
}

const RESET_PREFIX = 'auth:reset:';
const VERIFY_PREFIX = 'auth:verify:';
const MAGIC_PREFIX = 'auth:magic:';
const MAGIC_TTL_MS = 15 * 60 * 1000; // 15 min

@Injectable()
export class AuthService {
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly jwtService: JwtService,
    private readonly blacklistService: JwtBlacklistService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokens> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Un compte existe déjà avec cet email.');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        ...(dto.phone !== undefined && { phone: dto.phone }),
        role: dto.role ?? 'BUYER',
        country: dto.country ?? 'BJ',
      },
    });

    // Send verification email asynchronously (don't block register)
    void this.sendVerificationEmail(user.id, user.email, user.firstName);

    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user?.passwordHash) throw new UnauthorizedException('Identifiants incorrects.');

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Identifiants incorrects.');

    if (user.isBanned) throw new UnauthorizedException('Compte suspendu. Contactez le support.');

    if (user.twoFactorEnabled && dto.totpCode) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret ?? '',
        encoding: 'base32',
        token: dto.totpCode,
        window: 1,
      });
      if (!verified) throw new UnauthorizedException('Code 2FA invalide.');
    }

    return this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; jti?: string }>(
        refreshToken,
      );
      if (payload.jti && (await this.blacklistService.isBlacklisted(payload.jti))) {
        throw new UnauthorizedException('Refresh token révoqué.');
      }
      // One-time use: blacklist the consumed refresh token
      if (payload.jti) {
        const decoded = this.jwtService.decode(refreshToken) as {
          jti?: string;
          exp?: number;
        } | null;
        const now = Math.floor(Date.now() / 1000);
        const ttl = (decoded?.exp ?? now + 86400 * 30) - now;
        if (ttl > 0) await this.blacklistService.blacklist(payload.jti, ttl);
      }
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré.');
    }
  }

  async logout(token: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as { jti?: string; exp?: number } | null;
    if (!decoded?.jti) return;
    const now = Math.floor(Date.now() / 1000);
    const ttl = (decoded.exp ?? now + 3600) - now;
    if (ttl > 0) {
      await this.blacklistService.blacklist(decoded.jti, ttl);
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    const isValid = await bcrypt.compare(oldPassword, user.passwordHash ?? '');
    if (!isValid) throw new UnauthorizedException('Mot de passe actuel incorrect.');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return; // Silent fail — don't reveal if email exists

    const token = randomBytes(32).toString('hex');
    await this.cache.set(`${RESET_PREFIX}${token}`, user.id, 3600 * 1000);

    const resetUrl = `https://afribayit.com/reinitialiser-mot-de-passe?token=${token}`;
    await this.emailService.send({
      to: email,
      subject: 'Réinitialisation de votre mot de passe AfriBayit',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #003087; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Afri<span style="color: #D4AF37;">Bayit</span></h1>
          </div>
          <div style="padding: 32px;">
            <p>Bonjour ${user.firstName},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <p>Ce lien expire dans <strong>1 heure</strong>.</p>
            <a href="${resetUrl}" style="background: #003087; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; display: inline-block; margin: 16px 0;">
              Réinitialiser mon mot de passe
            </a>
            <p style="color: #666; font-size: 14px;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
          </div>
        </div>
      `,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const userId = await this.cache.get<string>(`${RESET_PREFIX}${token}`);
    if (!userId) throw new BadRequestException('Lien de réinitialisation invalide ou expiré.');
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { passwordHash } });
    await this.cache.del(`${RESET_PREFIX}${token}`);
  }

  async sendVerificationEmail(userId: string, email: string, firstName: string): Promise<void> {
    const token = randomBytes(32).toString('hex');
    await this.cache.set(`${VERIFY_PREFIX}${token}`, userId, 24 * 3600 * 1000);

    const verifyUrl = `https://afribayit.com/verifier-email?token=${token}`;
    await this.emailService.send({
      to: email,
      subject: 'Vérifiez votre adresse email AfriBayit',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #003087; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Afri<span style="color: #D4AF37;">Bayit</span></h1>
          </div>
          <div style="padding: 32px;">
            <p>Bonjour ${firstName},</p>
            <p>Bienvenue sur AfriBayit ! Veuillez vérifier votre adresse email.</p>
            <p>Ce lien expire dans <strong>24 heures</strong>.</p>
            <a href="${verifyUrl}" style="background: #003087; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; display: inline-block; margin: 16px 0;">
              Vérifier mon email
            </a>
          </div>
        </div>
      `,
    });
  }

  async verifyEmail(token: string): Promise<void> {
    const userId = await this.cache.get<string>(`${VERIFY_PREFIX}${token}`);
    if (!userId) throw new BadRequestException('Lien de vérification invalide ou expiré.');
    await this.prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    });
    await this.cache.del(`${VERIFY_PREFIX}${token}`);
  }

  async sendMagicLink(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return; // Silent fail — don't reveal if email exists

    const token = randomBytes(32).toString('hex');
    await this.cache.set(`${MAGIC_PREFIX}${token}`, user.id, MAGIC_TTL_MS);

    const magicUrl = `${process.env['FRONTEND_URL'] ?? 'https://afribayit.com'}/connexion/lien-magique?token=${token}`;
    await this.emailService.send({
      to: email,
      subject: 'Votre lien de connexion AfriBayit',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #003087; padding: 24px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Afri<span style="color: #D4AF37;">Bayit</span></h1>
          </div>
          <div style="padding: 32px;">
            <p>Bonjour ${user.firstName},</p>
            <p>Cliquez sur le bouton ci-dessous pour vous connecter instantanément à votre compte AfriBayit.</p>
            <p>Ce lien est valable <strong>15 minutes</strong> et ne peut être utilisé qu'une seule fois.</p>
            <a href="${magicUrl}" style="background: #003087; color: white; padding: 12px 24px; border-radius: 24px; text-decoration: none; display: inline-block; margin: 16px 0;">
              Se connecter maintenant
            </a>
            <p style="color: #666; font-size: 14px;">Si vous n'avez pas fait cette demande, ignorez cet email. Votre compte reste sécurisé.</p>
          </div>
        </div>
      `,
    });
  }

  async verifyMagicLink(token: string): Promise<AuthTokens> {
    const userId = await this.cache.get<string>(`${MAGIC_PREFIX}${token}`);
    if (!userId) throw new BadRequestException('Lien de connexion invalide ou expiré.');

    await this.cache.del(`${MAGIC_PREFIX}${token}`);

    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    if (user.isBanned) throw new UnauthorizedException('Compte suspendu. Contactez le support.');

    // Mark email as verified if not already done
    if (!user.emailVerified) {
      await this.prisma.user.update({ where: { id: userId }, data: { emailVerified: new Date() } });
    }

    return this.generateTokens(user);
  }

  async setup2FA(userId: string): Promise<{ secret: string; otpauthUrl: string }> {
    const secret = speakeasy.generateSecret({ name: 'AfriBayit', length: 20 });

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret.base32 },
    });

    return {
      secret: secret.base32 ?? '',
      otpauthUrl: secret.otpauth_url ?? '',
    };
  }

  async verify2FA(userId: string, token: string): Promise<void> {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret ?? '',
      encoding: 'base32',
      token,
      window: 1,
    });

    if (!verified) throw new UnauthorizedException('Code invalide.');

    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
  }

  async validateById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id, isActive: true } });
  }

  /** Verify a TOTP code for a user without requiring 2FA to be enabled */
  async verifyTotpCode(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.twoFactorSecret) return false;
    return speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: code,
      window: 1,
    });
  }

  /** Check whether a user has 2FA enabled */
  async is2FAEnabled(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    return user?.twoFactorEnabled ?? false;
  }

  private generateTokens(user: User): AuthTokens {
    const jti = randomUUID();
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role, jti };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(
      { ...payload, jti: randomUUID() },
      { expiresIn: '30d' },
    );

    const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user;

    return { accessToken, refreshToken, user: safeUser };
  }
}
