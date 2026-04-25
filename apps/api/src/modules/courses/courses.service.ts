import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';

export interface CreateCourseDto {
  title: string;
  description: string;
  category?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price?: number;
  currency?: string;
  thumbnailUrl?: string;
  tags?: string[];
}

export interface CreateLessonDto {
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
}

@Injectable()
export class CoursesService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async findAll(category?: string, level?: string, isFree?: boolean, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = { isPublished: true };
    if (category) where['category'] = category;
    if (level) where['level'] = level;
    if (isFree !== undefined) where['price'] = isFree ? 0 : { gt: 0 };

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: { _count: { select: { enrollments: true, lessons: true } } },
        orderBy: [{ isFeatured: 'desc' }, { enrolledCount: 'desc' }],
      }),
      this.prisma.course.count({ where }),
    ]);
    return { data: courses, total, page, limit };
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        lessons: { orderBy: { order: 'asc' } },
        _count: { select: { enrollments: true } },
        instructor: { select: { firstName: true, lastName: true, avatar: true, bio: true } },
      },
    });
    if (!course) throw new NotFoundException('Formation introuvable');
    return course;
  }

  async create(dto: CreateCourseDto, instructorId: string) {
    const slug = this.generateSlug(dto.title);
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        level: dto.level,
        slug,
        instructorId,
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.thumbnailUrl !== undefined ? { thumbnailUrl: dto.thumbnailUrl } : {}),
        ...(dto.tags !== undefined ? { tags: dto.tags } : {}),
        currency: dto.currency ?? 'XOF',
        isPublished: false,
        isFeatured: false,
        enrolledCount: 0,
        rating: 0,
        reviewCount: 0,
      },
    });
  }

  async enroll(courseId: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Formation introuvable');

    const existing = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) return existing;

    const [enrollment] = await this.prisma.$transaction([
      this.prisma.enrollment.create({
        data: { userId, courseId, progress: 0, status: 'ACTIVE' },
      }),
      this.prisma.course.update({
        where: { id: courseId },
        data: { enrolledCount: { increment: 1 } },
      }),
    ]);
    return enrollment;
  }

  async updateProgress(enrollmentId: string, userId: string, progress: number) {
    const enrollment = await this.prisma.enrollment.findUnique({ where: { id: enrollmentId } });
    if (!enrollment || enrollment.userId !== userId) throw new ForbiddenException();
    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress,
        status: progress >= 100 ? 'COMPLETED' : 'ACTIVE',
        completedAt: progress >= 100 ? new Date() : null,
      },
    });
  }

  async getMyEnrollments(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnailUrl: true,
            category: true,
            level: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async addLesson(dto: CreateLessonDto, instructorId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course || course.instructorId !== instructorId) throw new ForbiddenException();
    return this.prisma.lesson.create({ data: dto });
  }

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${base}-${Date.now()}`;
  }
}
