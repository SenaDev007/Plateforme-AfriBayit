import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { PrismaClient, User, KycLevel } from '@afribayit/db';

interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  city?: string;
}

@Injectable()
export class UsersService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Omit<User, 'passwordHash' | 'twoFactorSecret'>> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        kycDocuments: { select: { status: true, level: true, type: true } },
        _count: {
          select: { properties: true, favorites: true, receivedReviews: true },
        },
      },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user;
    return safeUser as Omit<User, 'passwordHash' | 'twoFactorSecret'>;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<Omit<User, 'passwordHash' | 'twoFactorSecret'>> {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user;
    return safeUser;
  }

  /** Submit KYC document reference after R2 upload */
  async submitKycDocument(userId: string, params: {
    type: string;
    fileUrl: string;
    fileKey: string;
    level: KycLevel;
  }): Promise<void> {
    await this.prisma.kycDocument.create({
      data: {
        userId,
        type: params.type,
        fileUrl: params.fileUrl,
        fileKey: params.fileKey,
        level: params.level,
        status: 'PENDING',
      },
    });
  }

  /** Get user favorites */
  async getFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        property: {
          include: { images: { where: { isPrimary: true }, take: 1 } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Toggle favorite */
  async toggleFavorite(userId: string, propertyId: string): Promise<{ favorited: boolean }> {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    if (existing) {
      await this.prisma.favorite.delete({ where: { userId_propertyId: { userId, propertyId } } });
      return { favorited: false };
    }

    await this.prisma.favorite.create({ data: { userId, propertyId } });
    return { favorited: true };
  }
}
