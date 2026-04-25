import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { PrismaClient, Prisma } from '@afribayit/db';
import type { Country, Currency, HotelRoomType } from '@afribayit/db';

export interface SearchHotelsDto {
  city?: string;
  type?: string;
  starRating?: number;
  minPrice?: number;
  maxPrice?: number;
  checkIn?: string;
  checkOut?: string;
  page?: number;
  limit?: number;
}

export interface CreateHotelDto {
  name: string;
  description: string;
  type?: string;
  starRating: number;
  country: Country;
  city: string;
  address: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  amenities?: Prisma.InputJsonValue;
  images?: Prisma.InputJsonValue;
}

export interface CreateRoomDto {
  hotelId: string;
  type: HotelRoomType;
  name: string;
  description?: string;
  pricePerNight: number;
  currency?: Currency;
  capacity: number;
  images?: Prisma.InputJsonValue;
  amenities?: Prisma.InputJsonValue;
}

@Injectable()
export class HotelsService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async search(dto: SearchHotelsDto) {
    const { page = 1, limit = 12, city, type, starRating, minPrice, maxPrice } = dto;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isPublished: true, isActive: true };
    if (city) where['city'] = { contains: city, mode: 'insensitive' };
    if (type) where['type'] = type;
    if (starRating) where['starRating'] = { gte: starRating };
    if (minPrice || maxPrice) {
      where['rooms'] = {
        some: {
          pricePerNight: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {}),
          },
          isAvailable: true,
        },
      };
    }

    const [hotels, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        skip,
        take: limit,
        include: {
          rooms: {
            where: { isAvailable: true },
            select: { pricePerNight: true, currency: true, type: true },
          },
          _count: { select: { bookings: true } },
        },
        orderBy: { starRating: 'desc' },
      }),
      this.prisma.hotel.count({ where }),
    ]);

    return { data: hotels, total, page, limit };
  }

  async findBySlug(slug: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { slug },
      include: {
        rooms: { orderBy: { pricePerNight: 'asc' } },
        owner: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });
    if (!hotel) throw new NotFoundException(`Hôtel introuvable`);
    return hotel;
  }

  async create(dto: CreateHotelDto, ownerId: string) {
    const slug = this.generateSlug(dto.name, dto.city);
    return this.prisma.hotel.create({
      data: {
        slug,
        name: dto.name,
        description: dto.description,
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        starRating: dto.starRating,
        country: dto.country,
        city: dto.city,
        address: dto.address,
        ...(dto.district !== undefined ? { district: dto.district } : {}),
        ...(dto.latitude !== undefined ? { latitude: dto.latitude } : {}),
        ...(dto.longitude !== undefined ? { longitude: dto.longitude } : {}),
        ...(dto.amenities !== undefined ? { amenities: dto.amenities } : {}),
        ...(dto.images !== undefined ? { images: dto.images } : {}),
        ownerId,
        isPublished: false,
      },
    });
  }

  async createRoom(dto: CreateRoomDto) {
    return this.prisma.hotelRoom.create({
      data: {
        hotelId: dto.hotelId,
        type: dto.type,
        name: dto.name,
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        pricePerNight: dto.pricePerNight,
        ...(dto.currency !== undefined ? { currency: dto.currency } : {}),
        capacity: dto.capacity,
        ...(dto.images !== undefined ? { images: dto.images } : {}),
        ...(dto.amenities !== undefined ? { amenities: dto.amenities } : {}),
      },
    });
  }

  async checkAvailability(hotelId: string, checkIn: string, checkOut: string) {
    const rooms = await this.prisma.hotelRoom.findMany({
      where: { hotelId, isAvailable: true },
    });
    const bookings = await this.prisma.hotelBooking.findMany({
      where: {
        hotelId,
        status: { notIn: ['CANCELLED'] },
        OR: [
          {
            checkIn: { lte: new Date(checkOut) },
            checkOut: { gte: new Date(checkIn) },
          },
        ],
      },
      select: { roomId: true },
    });
    const bookedRoomIds = new Set(bookings.map((b) => b.roomId));
    return rooms.map((r) => ({ ...r, available: !bookedRoomIds.has(r.id) }));
  }

  async book(data: {
    hotelId: string;
    roomId: string;
    userId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    notes?: string;
  }) {
    const room = await this.prisma.hotelRoom.findUnique({ where: { id: data.roomId } });
    if (!room) throw new NotFoundException('Chambre introuvable');
    const nights = Math.ceil(
      (new Date(data.checkOut).getTime() - new Date(data.checkIn).getTime()) / 86400000,
    );
    const totalPrice = Number(room.pricePerNight) * Math.max(1, nights);

    return this.prisma.hotelBooking.create({
      data: {
        hotelId: data.hotelId,
        roomId: data.roomId,
        userId: data.userId,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
        guests: data.guests,
        totalPrice,
        currency: room.currency,
        status: 'PENDING',
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
      },
      include: {
        room: { select: { name: true, type: true } },
        hotel: { select: { name: true, city: true } },
      },
    });
  }

  async getMyBookings(userId: string) {
    return this.prisma.hotelBooking.findMany({
      where: { userId },
      include: {
        hotel: { select: { id: true, name: true, city: true, images: true } },
        room: { select: { name: true, type: true, pricePerNight: true, currency: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private generateSlug(name: string, city: string): string {
    const base = `${name}-${city}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${base}-${Date.now()}`;
  }
}
