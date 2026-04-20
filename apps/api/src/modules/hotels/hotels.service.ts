import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';

export interface SearchHotelsDto {
  ville?: string;
  type?: string;
  stars?: number;
  prixMin?: number;
  prixMax?: number;
  checkin?: string;
  checkout?: string;
  amenities?: string;
  page?: number;
  limit?: number;
}

export interface CreateHotelDto {
  name: string;
  type: string;
  stars: number;
  description: string;
  country: string;
  city: string;
  district?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  pricePerNight: number;
  currency?: string;
}

export interface CreateRoomDto {
  hotelId: string;
  name: string;
  bedType: string;
  surface?: number;
  pricePerNight: number;
  maxGuests: number;
  amenities?: string[];
}

@Injectable()
export class HotelsService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async search(dto: SearchHotelsDto) {
    const { page = 1, limit = 12, ville, type, stars, prixMin, prixMax } = dto;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isPublished: true };
    if (ville) where['city'] = { contains: ville, mode: 'insensitive' };
    if (type) where['type'] = type;
    if (stars) where['stars'] = { gte: stars };
    if (prixMin || prixMax) {
      where['rooms'] = {
        some: {
          pricePerNight: {
            ...(prixMin ? { gte: prixMin } : {}),
            ...(prixMax ? { lte: prixMax } : {}),
          },
        },
      };
    }

    const [hotels, total] = await Promise.all([
      this.prisma.hotel.findMany({ where, skip, take: limit, include: { rooms: true, images: true } }),
      this.prisma.hotel.count({ where }),
    ]);

    return { data: hotels, total, page, limit };
  }

  async findBySlug(slug: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug },
      include: { rooms: true, images: true },
    });
    if (!hotel) throw new NotFoundException(`Hôtel ${slug} introuvable`);
    return hotel;
  }

  async create(dto: CreateHotelDto, ownerId: string) {
    const slug = this.generateSlug(dto.name, dto.city);
    return this.prisma.hotel.create({
      data: {
        ...dto,
        slug,
        ownerId,
        currency: dto.currency ?? 'XOF',
        isPublished: false,
      },
    });
  }

  async createRoom(dto: CreateRoomDto) {
    return this.prisma.hotelRoom.create({ data: dto });
  }

  async checkAvailability(hotelId: string, checkin: string, checkout: string) {
    const rooms = await this.prisma.hotelRoom.findMany({ where: { hotelId } });
    const bookings = await this.prisma.hotelBooking.findMany({
      where: {
        hotelId,
        status: { notIn: ['CANCELLED', 'REJECTED'] },
        OR: [
          { checkin: { lte: new Date(checkout) }, checkout: { gte: new Date(checkin) } },
        ],
      },
      select: { roomId: true },
    });
    const bookedRoomIds = new Set(bookings.map((b) => b.roomId));
    return rooms.map((r) => ({ ...r, available: !bookedRoomIds.has(r.id) }));
  }

  async book(data: { hotelId: string; roomId: string; guestId: string; checkin: string; checkout: string; guestCount: number }) {
    const room = await this.prisma.hotelRoom.findUnique({ where: { id: data.roomId } });
    if (!room) throw new NotFoundException('Chambre introuvable');
    const nights = Math.ceil((new Date(data.checkout).getTime() - new Date(data.checkin).getTime()) / 86400000);
    const totalPrice = room.pricePerNight * nights;

    return this.prisma.hotelBooking.create({
      data: {
        hotelId: data.hotelId,
        roomId: data.roomId,
        guestId: data.guestId,
        checkin: new Date(data.checkin),
        checkout: new Date(data.checkout),
        guestCount: data.guestCount,
        totalPrice,
        currency: room.currency ?? 'XOF',
        status: 'PENDING',
      },
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
