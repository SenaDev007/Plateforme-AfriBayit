import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { PrismaClient, User, KycLevel } from '@afribayit/db';
import { DocumentAIService } from './document-ai.service';

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
  constructor(
    @Inject('PRISMA') private readonly prisma: PrismaClient,
    private readonly documentAI: DocumentAIService,
  ) {}

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

  async updateProfile(
    id: string,
    dto: UpdateProfileDto,
  ): Promise<Omit<User, 'passwordHash' | 'twoFactorSecret'>> {
    const user = await this.prisma.user.update({
      where: { id },
      data: dto,
    });
    const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user;
    return safeUser;
  }

  /** Submit KYC document reference after R2 upload */
  async submitKycDocument(
    userId: string,
    params: {
      type: string;
      fileUrl: string;
      fileKey: string;
      level: KycLevel;
    },
  ): Promise<void> {
    const doc = await this.prisma.kycDocument.create({
      data: {
        userId,
        type: params.type,
        fileUrl: params.fileUrl,
        fileKey: params.fileKey,
        level: params.level,
        status: 'PENDING',
      },
    });

    this.documentAI.analyzeKycDocument(doc.id).catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`DocumentAI fire-and-forget error for doc ${doc.id}: ${msg}`);
    });
  }

  /** Find all KYC documents pending review */
  async findPendingKycDocuments() {
    return this.prisma.kycDocument.findMany({
      where: { status: 'PENDING' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Review a KYC document and update user level if approved */
  async reviewKycDocument(
    documentId: string,
    status: 'APPROVED' | 'REJECTED',
    note: string,
    adminId: string,
  ) {
    const document = await this.prisma.kycDocument.update({
      where: { id: documentId },
      data: {
        status,
        reviewNote: note,
        reviewedAt: new Date(),
        reviewedBy: adminId,
      },
    });

    if (status === 'APPROVED') {
      await this.updateUserKycLevel(document.userId);
    }

    return document;
  }

  /** Calculate and update the user's KYC level based on approved documents */
  private async updateUserKycLevel(userId: string) {
    const approvedDocs = await this.prisma.kycDocument.findMany({
      where: {
        userId,
        status: 'APPROVED',
      },
      select: { level: true },
    });

    if (approvedDocs.length === 0) return;

    const levels = approvedDocs.map((doc) => doc.level);

    // Determine the highest achieved level
    let targetLevel: KycLevel = 'NONE';
    if (levels.includes('LEVEL_3')) targetLevel = 'LEVEL_3';
    else if (levels.includes('LEVEL_2')) targetLevel = 'LEVEL_2';
    else if (levels.includes('LEVEL_1')) targetLevel = 'LEVEL_1';

    await this.prisma.user.update({
      where: { id: userId },
      data: { kycLevel: targetLevel },
    });
  }

  /** Find all users with pagination and filters */
  async findAllUsers(params: { skip?: number; take?: number; role?: string; status?: string }) {
    const { skip = 0, take = 20, role, status } = params;

    return this.prisma.user.findMany({
      where: {
        ...(role ? { role: role as any } : {}),
        ...(status === 'BANNED' ? { isBanned: true } : {}),
        ...(status === 'ACTIVE' ? { isBanned: false } : {}),
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Update user role */
  async updateUserRole(id: string, role: any) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  /** Ban or unban a user */
  async updateUserStatus(id: string, status: 'ACTIVE' | 'BANNED') {
    return this.prisma.user.update({
      where: { id },
      data: { isBanned: status === 'BANNED' },
    });
  }

  /** GDPR — export all personal data for a user */
  async exportMyData(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        properties: { select: { id: true, title: true, status: true, createdAt: true } },
        kycDocuments: { select: { type: true, status: true, level: true, createdAt: true } },
        receivedReviews: { select: { rating: true, comment: true, createdAt: true } },
        favorites: {
          include: { property: { select: { id: true, title: true } } },
        },
      },
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable.');
    const { passwordHash: _, twoFactorSecret: __, ...safeUser } = user;
    return safeUser;
  }

  /** GDPR — anonymise and deactivate account (right to erasure) */
  async deleteMyAccount(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: `deleted-${userId}@deleted.afribayit.com`,
        firstName: 'Deleted',
        lastName: 'User',
        phone: null,
        avatar: null,
        bio: null,
        passwordHash: '',
        twoFactorSecret: null,
        twoFactorEnabled: false,
        isActive: false,
        isBanned: true,
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
