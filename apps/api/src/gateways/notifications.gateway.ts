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
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: [/\.afribayit\.com$/, 'http://localhost:3000'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  // userId → Set of socketIds
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

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
      this.logger.log(`Client connected: ${client.id} (user: ${userId})`);
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
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /** Send a real-time notification to a specific user (all their devices). */
  sendToUser(userId: string, event: string, payload: Record<string, unknown>): void {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  /** Broadcast a notification to all connected clients (system-wide). */
  broadcast(event: string, payload: Record<string, unknown>): void {
    this.server.emit(event, payload);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket, @MessageBody() data: unknown): void {
    client.emit('pong', { ts: Date.now(), echo: data });
  }
}
