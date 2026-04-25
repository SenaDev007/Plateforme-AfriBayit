import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import type { PrismaClient } from '@afribayit/db';

export interface CreatePostDto {
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  groupId?: string;
}

export interface CreateGroupDto {
  name: string;
  description?: string;
  category?: string;
  isPrivate?: boolean;
}

@Injectable()
export class CommunityService {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async getPosts(category?: string, groupId?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.communityPost.findMany({
        where: {
          isActive: true,
          ...(category ? { category } : {}),
          ...(groupId ? { groupId } : {}),
        },
        skip,
        take: limit,
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true, avatar: true, city: true },
          },
          _count: { select: { likes: true, comments: true } },
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.communityPost.count({
        where: {
          isActive: true,
          ...(category ? { category } : {}),
          ...(groupId ? { groupId } : {}),
        },
      }),
    ]);
    return { data: posts, total, page, limit };
  }

  async getPostBySlug(slug: string) {
    const post = await this.prisma.communityPost.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true, city: true } },
        comments: {
          take: 50,
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          },
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
        slug,
        title: dto.title,
        content: dto.content,
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        tags: dto.tags ?? [],
        ...(dto.groupId !== undefined ? { groupId: dto.groupId } : {}),
        authorId,
        views: 0,
        isPinned: false,
      },
    });
  }

  async updatePost(id: string, dto: Partial<CreatePostDto>, userId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) throw new ForbiddenException();
    return this.prisma.communityPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.content !== undefined ? { content: dto.content } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.tags !== undefined ? { tags: dto.tags } : {}),
      },
    });
  }

  async deletePost(id: string, userId: string) {
    const post = await this.prisma.communityPost.findUnique({ where: { id } });
    if (!post || post.authorId !== userId) throw new ForbiddenException();
    return this.prisma.communityPost.update({ where: { id }, data: { isActive: false } });
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

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.prisma.postComment.findUnique({ where: { id: commentId } });
    if (!comment || comment.authorId !== userId) throw new ForbiddenException();
    return this.prisma.postComment.delete({ where: { id: commentId } });
  }

  async getGroups(category?: string) {
    return this.prisma.communityGroup.findMany({
      where: category ? { category } : {},
      include: { _count: { select: { members: true, posts: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getGroupBySlug(slug: string) {
    const group = await this.prisma.communityGroup.findUnique({
      where: { slug },
      include: {
        _count: { select: { members: true, posts: true } },
        creator: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });
    if (!group) throw new NotFoundException('Groupe introuvable');
    return group;
  }

  async createGroup(dto: CreateGroupDto, creatorId: string) {
    const slug = this.generateSlug(dto.name);
    return this.prisma.$transaction(async (tx) => {
      const group = await tx.communityGroup.create({
        data: {
          name: dto.name,
          slug,
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.category !== undefined ? { category: dto.category } : {}),
          isPrivate: dto.isPrivate ?? false,
          creatorId,
        },
      });
      await tx.groupMember.create({
        data: { groupId: group.id, userId: creatorId, role: 'ADMIN' },
      });
      return group;
    });
  }

  async joinGroup(groupId: string, userId: string) {
    const existing = await this.prisma.groupMember.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });
    if (existing) return existing;
    return this.prisma.groupMember.create({ data: { groupId, userId, role: 'MEMBER' } });
  }

  async leaveGroup(groupId: string, userId: string) {
    return this.prisma.groupMember.deleteMany({ where: { groupId, userId } });
  }

  /** Submit a review for a user or property */
  async createReview(params: {
    authorId: string;
    targetId: string;
    propertyId?: string;
    rating: number;
    comment?: string;
  }) {
    return this.prisma.review.create({
      data: {
        authorId: params.authorId,
        targetId: params.targetId,
        ...(params.propertyId !== undefined ? { propertyId: params.propertyId } : {}),
        rating: params.rating,
        ...(params.comment !== undefined ? { comment: params.comment } : {}),
      },
    });
  }

  async getReviewsForTarget(targetId: string) {
    return this.prisma.review.findMany({
      where: { targetId },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private generateSlug(title: string): string {
    const base = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return `${base}-${Date.now()}`;
  }
}
