import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { PrismaClient } from '@afribayit/db';

interface SendMessagePayload {
  recipientId: string;
  content: string;
}

interface TypingPayload {
  recipientId: string;
}

@WebSocketGateway({
  cors: {
    origin: [/\.afribayit\.com$/, 'http://localhost:3000'],
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    @Inject('PRISMA') private readonly prisma: PrismaClient,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const token =
        (client.handshake.auth['token'] as string) ??
        (client.handshake.headers['authorization'] as string)?.replace('Bearer ', '');

      if (!token) throw new Error('No token');
      const payload = this.jwtService.verify<{ sub: string }>(token);
      const userId = payload.sub;

      client.data['userId'] = userId;
      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(client.id);

      await client.join(`user:${userId}`);
      this.logger.log(`Chat client connected: ${client.id} (user: ${userId})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = client.data['userId'] as string | undefined;
    if (userId) {
      this.userSockets.get(userId)?.delete(client.id);
      if (this.userSockets.get(userId)?.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessagePayload,
  ): Promise<void> {
    const senderId = client.data['userId'] as string | undefined;
    if (!senderId) return;

    // Get or create conversation
    const [a, b] = [senderId, data.recipientId].sort();
    let conversation = await this.prisma.conversation.findUnique({
      where: { participantA_participantB: { participantA: a!, participantB: b! } },
    });
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { participantA: a!, participantB: b! },
      });
    }

    const message = await this.prisma.directMessage.create({
      data: {
        conversationId: conversation.id,
        senderId,
        content: data.content,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });

    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    // Deliver to recipient
    this.server.to(`user:${data.recipientId}`).emit('new_message', message);
    // Confirm to sender
    client.emit('message_sent', message);
  }

  @SubscribeMessage('typing')
  handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: TypingPayload): void {
    const senderId = client.data['userId'] as string | undefined;
    if (!senderId) return;
    this.server.to(`user:${data.recipientId}`).emit('user_typing', { userId: senderId });
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ): Promise<void> {
    const userId = client.data['userId'] as string | undefined;
    if (!userId) return;
    await this.prisma.directMessage.updateMany({
      where: { conversationId: data.conversationId, senderId: { not: userId }, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /** Push a message to a user from server-side (e.g., system notification) */
  sendToUser(userId: string, event: string, payload: Record<string, unknown>): void {
    this.server.to(`user:${userId}`).emit(event, payload);
  }
}
