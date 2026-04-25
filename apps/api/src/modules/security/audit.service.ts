import { Injectable, Inject, Logger } from '@nestjs/common';
import type { PrismaClient } from '@afribayit/db';

export interface AuditEvent {
  actorId?: string;
  actorIp?: string;
  actorRole?: string;
  action: string;
  resource: string;
  resourceId?: string;
  tenantId?: string;
  metadata?: Record<string, unknown>;
  result?: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  async log(event: AuditEvent): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          ...(event.actorId !== undefined ? { actorId: event.actorId } : {}),
          ...(event.actorIp !== undefined ? { actorIp: event.actorIp } : {}),
          ...(event.actorRole !== undefined ? { actorRole: event.actorRole } : {}),
          action: event.action,
          resource: event.resource,
          ...(event.resourceId !== undefined ? { resourceId: event.resourceId } : {}),
          ...(event.tenantId !== undefined ? { tenantId: event.tenantId } : {}),
          ...(event.metadata !== undefined ? { metadata: event.metadata as object } : {}),
          result: event.result ?? 'SUCCESS',
        },
      });
    } catch (error) {
      this.logger.error('Failed to write audit log', error);
    }
  }

  /** Fetch audit logs — admin only */
  async findAll(params: {
    actorId?: string;
    action?: string;
    tenantId?: string;
    from?: Date;
    to?: Date;
    skip?: number;
    take?: number;
  }) {
    const { skip = 0, take = 50, from, to, ...filters } = params;
    return this.prisma.auditLog.findMany({
      where: {
        ...(filters.actorId ? { actorId: filters.actorId } : {}),
        ...(filters.action ? { action: filters.action } : {}),
        ...(filters.tenantId ? { tenantId: filters.tenantId } : {}),
        ...(from || to
          ? { createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lte: to } : {}) } }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Math.min(take, 200),
    });
  }
}
