import { Injectable, UnauthorizedException, ConflictException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import type { PrismaClient, User } from '@afribayit/db';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'passwordHash' | 'twoFactorSecret'>;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  /** Hash and register a new user */
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
        phone: dto.phone,
        role: dto.role ?? 'BUYER',
        country: dto.country ?? 'BJ',
      },
    });

    return this.generateTokens(user);
  }

  /** Validate credentials and return tokens */
  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

    if (!user?.passwordHash) throw new UnauthorizedException('Identifiants incorrects.');

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) throw new UnauthorizedException('Identifiants incorrects.');

    if (user.isBanned) throw new UnauthorizedException('Compte suspendu. Contactez le support.');

    // 2FA check
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

  /** Setup TOTP 2FA for a user — returns QR data URI */
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

  /** Verify TOTP token and enable 2FA */
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

  /** Validate user by ID — used by JWT strategy */
  async validateById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id, isActive: true } });
  }

  private generateTokens(user: User): AuthTokens {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user;

    return { accessToken, refreshToken, user: safeUser };
  }
}
