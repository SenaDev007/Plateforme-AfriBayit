import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';

export interface SearchArtisansDto {
  ville?: string;
  categorie?: string;
  noteMin?: number;
  disponible?: boolean;
  certifie?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateArtisanProfileDto {
  companyName: string;
  category: string;
  bio: string;
  country: string;
  city: string;
  district?: string;
  specialties?: string[];
  hourlyRate?: number;
  currency?: string;
  phone: string;
  whatsapp?: string;
}

export interface CreateReviewDto {
  artisanId: string;
  rating: number;
  comment: string;
  jobDescription?: string;
}

@Injectable()
export class ArtisansService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async search(dto: SearchArtisansDto) {
    const { page = 1, limit = 12, ville, categorie, noteMin, disponible, certifie } = dto;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isActive: true };
    if (ville) where['city'] = { contains: ville, mode: 'insensitive' };
    if (categorie) where['category'] = categorie;
    if (certifie !== undefined) where['isCertified'] = certifie;
    if (disponible !== undefined) where['isAvailable'] = disponible;
    if (noteMin) where['rating'] = { gte: noteMin };

    const [artisans, total] = await Promise.all([
      this.prisma.artisan.findMany({
        where,
        skip,
        take: limit,
        include: { services: true },
        orderBy: [{ isCertified: 'desc' }, { rating: 'desc' }],
      }),
      this.prisma.artisan.count({ where }),
    ]);

    return { data: artisans, total, page, limit };
  }

  async findBySlug(slug: string) {
    const artisan = await this.prisma.artisan.findUnique({
      where: { slug },
      include: {
        services: true,
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { reviewer: { select: { firstName: true, lastName: true } } },
        },
      },
    });
    if (!artisan) throw new NotFoundException(`Artisan introuvable`);
    return artisan;
  }

  async createProfile(dto: CreateArtisanProfileDto, userId: string) {
    const slug = this.generateSlug(dto.companyName, dto.city);
    return this.prisma.artisan.create({
      data: {
        ...dto,
        slug,
        userId,
        currency: dto.currency ?? 'XOF',
        rating: 0,
        reviewCount: 0,
        jobsDone: 0,
        isActive: true,
        isCertified: false,
        isAvailable: true,
      },
    });
  }

  async addService(dto: { artisanId: string; name: string; description?: string; basePrice?: number; unit?: string }) {
    return this.prisma.artisanService.create({ data: dto });
  }

  async addReview(dto: CreateReviewDto, reviewerId: string) {
    const review = await this.prisma.review.create({
      data: {
        artisanId: dto.artisanId,
        reviewerId,
        rating: dto.rating,
        comment: dto.comment,
      },
    });

    // Recompute average rating
    const agg = await this.prisma.review.aggregate({
      where: { artisanId: dto.artisanId },
      _avg: { rating: true },
      _count: true,
    });
    await this.prisma.artisan.update({
      where: { id: dto.artisanId },
      data: {
        rating: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      },
    });

    return review;
  }

  async toggleAvailability(artisanId: string, userId: string) {
    const artisan = await this.prisma.artisan.findFirst({ where: { id: artisanId, userId } });
    if (!artisan) throw new NotFoundException('Profil artisan introuvable');
    return this.prisma.artisan.update({
      where: { id: artisanId },
      data: { isAvailable: !artisan.isAvailable },
    });
  }

  private generateSlug(name: string, city: string): string {
    const base = `${name}-${city}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${base}-${Date.now()}`;
  }
}
