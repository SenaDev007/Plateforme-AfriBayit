import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type {
  PrismaClient,
  Property,
  PropertyType,
  PropertyPurpose,
  Country,
  Currency,
} from '@afribayit/db';

interface CreatePropertyDto {
  title: string;
  description: string;
  type: PropertyType;
  purpose: PropertyPurpose;
  price: number;
  currency?: string;
  surface?: number;
  rooms?: number;
  bedrooms?: number;
  bathrooms?: number;
  country: Country;
  city: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
}

interface SearchPropertiesDto {
  q?: string;
  city?: string;
  purpose?: PropertyPurpose;
  type?: PropertyType;
  prixMin?: number;
  prixMax?: number;
  surfaceMin?: number;
  surfaceMax?: number;
  chambres?: number;
  country?: Country;
  page?: number;
  limit?: number;
}

@Injectable()
export class PropertiesService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  /** Create a new property listing */
  async create(ownerId: string, dto: CreatePropertyDto): Promise<Property> {
    const slug = this.generateSlug(dto.title, dto.city);
    const { features, currency, ...rest } = dto;
    return this.prisma.property.create({
      data: {
        ...rest,
        ...(currency !== undefined ? { currency: currency as Currency } : {}),
        slug,
        ownerId,
        status: 'DRAFT',
        ...(features ? { features: { set: features } } : {}),
      },
    });
  }

  /** Search properties with filters */
  async search(filters: SearchPropertiesDto): Promise<{ data: Property[]; total: number }> {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 12, 50);
    const skip = (page - 1) * limit;

    const where = {
      status: 'ACTIVE' as const,
      ...(filters.city && { city: { contains: filters.city, mode: 'insensitive' as const } }),
      ...(filters.purpose && { purpose: filters.purpose }),
      ...(filters.type && { type: filters.type }),
      ...(filters.country && { country: filters.country }),
      ...(filters.prixMin || filters.prixMax
        ? {
            price: {
              ...(filters.prixMin !== undefined && { gte: filters.prixMin }),
              ...(filters.prixMax !== undefined && { lte: filters.prixMax }),
            },
          }
        : {}),
      ...(filters.surfaceMin || filters.surfaceMax
        ? {
            surface: {
              ...(filters.surfaceMin !== undefined && { gte: filters.surfaceMin }),
              ...(filters.surfaceMax !== undefined && { lte: filters.surfaceMax }),
            },
          }
        : {}),
      ...(filters.chambres && { bedrooms: { gte: filters.chambres } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.property.findMany({
        where,
        include: {
          images: { where: { isPrimary: true }, take: 1 },
          owner: { select: { id: true, firstName: true, lastName: true } },
        },
        orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.property.count({ where }),
    ]);

    return { data, total };
  }

  /** Get property by slug — increments view count */
  async findBySlug(slug: string): Promise<Property> {
    const property = await this.prisma.property.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: 'asc' } },
        virtualTours: true,
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            reputationScore: true,
            kycLevel: true,
          },
        },
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { firstName: true, avatar: true } } },
        },
      },
    });

    if (!property) throw new NotFoundException('Propriété introuvable.');

    // Fire-and-forget view count
    void this.prisma.property.update({ where: { slug }, data: { viewCount: { increment: 1 } } });

    return property;
  }

  /** Update property — only owner can update */
  async update(slug: string, ownerId: string, dto: Partial<CreatePropertyDto>): Promise<Property> {
    const property = await this.prisma.property.findUnique({ where: { slug } });
    if (!property) throw new NotFoundException('Propriété introuvable.');
    if (property.ownerId !== ownerId) throw new ForbiddenException('Accès refusé.');

    const { features, currency, ...rest } = dto;
    return this.prisma.property.update({
      where: { slug },
      data: {
        ...rest,
        ...(currency !== undefined ? { currency: currency as Currency } : {}),
        ...(features !== undefined ? { features: { set: features } } : {}),
        updatedAt: new Date(),
      },
    });
  }

  /** Publish a draft property */
  async publish(slug: string, ownerId: string): Promise<Property> {
    return this.update(slug, ownerId, { status: 'ACTIVE' } as Parameters<typeof this.update>[2]);
  }

  private generateSlug(title: string, city: string): string {
    const base = `${title}-${city}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
    return `${base}-${Date.now().toString(36)}`;
  }
}
