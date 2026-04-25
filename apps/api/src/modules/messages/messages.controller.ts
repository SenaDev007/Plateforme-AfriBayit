import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  Version,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Inject } from '@nestjs/common';
import type { PrismaClient } from '@afribayit/db';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { User } from '@afribayit/db';

@ApiTags('Messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagesController {
  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  @Get('conversations')
  @Version('1')
  @ApiOperation({ summary: 'Mes conversations' })
  async getConversations(@CurrentUser() user: User) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ participantA: user.id }, { participantB: user.id }],
      },
      include: {
        userA: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        userB: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { content: true, createdAt: true, senderId: true, isRead: true },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  @Get('conversations/:id')
  @Version('1')
  @ApiOperation({ summary: "Historique d'une conversation" })
  async getMessages(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    const conv = await this.prisma.conversation.findFirst({
      where: {
        id,
        OR: [{ participantA: user.id }, { participantB: user.id }],
      },
    });
    if (!conv) return { data: [], total: 0 };

    const skip = (page - 1) * limit;
    const [messages, total] = await Promise.all([
      this.prisma.directMessage.findMany({
        where: { conversationId: id },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.directMessage.count({ where: { conversationId: id } }),
    ]);

    return { data: messages.reverse(), total, page, limit };
  }

  @Get('unread-count')
  @Version('1')
  @ApiOperation({ summary: 'Nombre de messages non lus' })
  async getUnreadCount(@CurrentUser() user: User) {
    const conversations = await this.prisma.conversation.findMany({
      where: { OR: [{ participantA: user.id }, { participantB: user.id }] },
      select: { id: true },
    });
    const count = await this.prisma.directMessage.count({
      where: {
        conversationId: { in: conversations.map((c) => c.id) },
        senderId: { not: user.id },
        isRead: false,
      },
    });
    return { count };
  }
}
