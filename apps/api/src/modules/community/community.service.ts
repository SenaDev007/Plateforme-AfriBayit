import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { PrismaClient } from '@prisma/client';

export interface CreatePostDto {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  groupId?: string;
}

export interface CreateGroupDto {
  name: string;
  description: string;
  category: string;
  isPrivate?: boolean;
}

@Injectable()
export class CommunityService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async getPosts(category?: string, groupId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (category) where['category'] = category;
    if (groupId) where['groupId'] = groupId;

    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: { select: { firstName: true, lastName: true, city: true } },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.communityPost.count({ where }),
    ]);
    return { data: posts, total, page, limit };
  }

  async getPostBySlug(slug: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { slug },
      include: {
        author: { select: { firstName: true, lastName: true, city: true, avatar: true } },
        comments: {
          take: 50,
          orderBy: { createdAt: 'asc' },
          include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
        },
        _count: { select: { likes: true, comments: true } },
      },
    });
    if (!post) throw new NotFoundException('Post introuvable');
    await this.prisma.communityPost.update({ where: { slug }, data: { views: { increment: 1 } } });
    return post;
  }

  async createPost(dto: CreatePostDto, authorId: string) {
    const slug = this.generateSlug(dto.title);
    return this.prisma.communityPost.create({
      data: {
        ...dto,
        slug,
        authorId,
        views: 0,
        isPinned: false,
      },
    });
  }

  async deletePost(id: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) throw new ForbiddenException();
    return this.prisma.communityPost.delete({ where: { id } });
  }

  async toggleLike(postId: string, userId: string) {
    const existing = await this.prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId } },
    });
    if (existing) {
      await this.prisma.postLike.delete({ where: { postId_userId: { postId, userId } } });
      return { liked: false };
    }
    await this.prisma.postLike.create({ data: { postId, userId } });
    return { liked: true };
  }

  async addComment(postId: string, content: string, authorId: string) {
    return this.prisma.postComment.create({ data: { postId, content, authorId } });
  }

  async getGroups(category?: string) {
    const where = category ? { category } : {};
    return this.prisma.communityGroup.findMany({
      where,
      include: { _count: { select: { members: true, posts: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createGroup(dto: CreateGroupDto, creatorId: string) {
    const slug = this.generateSlug(dto.name);
    return this.prisma.$transaction(async (tx) => {
      const group = await tx.communityGroup.create({
        data: { ...dto, slug, creatorId, isPrivate: dto.isPrivate ?? false },
      });
      await tx.groupMember.create({ data: { groupId: group.id, userId: creatorId, role: 'ADMIN' } });
      return group;
    });
  }

  async joinGroup(groupId: string, userId: string) {
    const existing = await this.prisma.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
    if (existing) return existing;
    return this.prisma.groupMember.create({ data: { groupId, userId, role: 'MEMBER' } });
  }

  async leaveGroup(groupId: string, userId: string) {
    return this.prisma.groupMember.deleteMany({ where: { groupId, userId } });
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
