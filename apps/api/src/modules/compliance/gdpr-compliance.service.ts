import { Injectable, Inject, Logger } from '@nestjs/common';
import type { PrismaClient } from '@afribayit/db';

/**
 * Section 10.8 — Conformité Réglementaire (RGPD, APDP Bénin, OHADA, BCEAO)
 * Droit à l'effacement, portabilité, consentement, notification violation < 72h.
 */

export interface ConsentRecord {
  userId: string;
  purpose: string;
  granted: boolean;
  grantedAt: Date;
  revokedAt?: Date;
  ipAddress: string;
}

@Injectable()
export class GDPRComplianceService {
  private readonly logger = new Logger(GDPRComplianceService.name);

  constructor(@Inject('PRISMA') private readonly prisma: PrismaClient) {}

  /** Section 10.8 RGPD — Droit à l'effacement (art. 17 RGPD) */
  async handleErasureRequest(userId: string): Promise<{
    erased: string[];
    retained: string[];
    retentionReason: string;
  }> {
    const erased: string[] = [];
    const retained: string[] = [];

    // Anonymize personal data
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        email: `erased-${userId}@afribayit.com`,
        firstName: 'ERASED',
        lastName: 'ERASED',
        phone: null,
        avatar: null,
        bio: null,
        city: null,
        isActive: false,
      },
    });
    erased.push('user_profile', 'email', 'phone', 'avatar', 'bio');

    // Keep: financial records (obligation légale 5 ans) + audit logs
    retained.push('transactions', 'escrow_records', 'audit_logs');

    this.logger.log(`GDPR erasure completed for user ${userId}`);
    return {
      erased,
      retained,
      retentionReason: 'Obligation légale conservation 5 ans (BCEAO/UEMOA) + archivage fiscal',
    };
  }

  /** Section 10.8 RGPD — Portabilité des données (art. 20) */
  async exportUserData(userId: string): Promise<Record<string, unknown>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        city: true,
        country: true,
        createdAt: true,
      },
    });

    const properties = await this.prisma.property.findMany({
      where: { ownerId: userId },
      select: { id: true, title: true, price: true, city: true, createdAt: true },
    });

    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { propertyId: true, createdAt: true },
    });

    return {
      exportDate: new Date().toISOString(),
      format: 'AfriBayit GDPR Export v1.0',
      user,
      properties,
      favorites,
      // Only own data — no bulk API (Section 10.2.3)
    };
  }

  /** Section 10.8 — Notification violation < 72h (RGPD art. 33 + APDP Bénin) */
  async notifyBreach(params: {
    incidentId: string;
    affectedUsers: number;
    dataTypes: string[];
    discoveredAt: Date;
  }): Promise<{
    deadlineNotifyAPDP: Date;
    deadlineNotifyUsers: Date;
    notificationSent: boolean;
  }> {
    const deadlineAPDP = new Date(params.discoveredAt.getTime() + 72 * 3600_000); // 72h
    const deadlineUsers = new Date(params.discoveredAt.getTime() + 72 * 3600_000);

    this.logger.warn(
      `[BREACH] Incident ${params.incidentId} — ${params.affectedUsers} users affected. ` +
        `APDP deadline: ${deadlineAPDP.toISOString()}`,
    );

    return {
      deadlineNotifyAPDP: deadlineAPDP,
      deadlineNotifyUsers: deadlineUsers,
      notificationSent: false, // Will be sent by incident response team
    };
  }

  /** Section 10.8 — APDP Bénin: déclaration préalable de traitement */
  getAPDPDeclarationStatus(): {
    declared: boolean;
    dpoDesignated: boolean;
    registrationNumber: string | null;
    dataLocalisation: string;
  } {
    return {
      declared: !!process.env['APDP_REGISTRATION_NUMBER'],
      dpoDesignated: !!process.env['DPO_EMAIL'],
      registrationNumber: process.env['APDP_REGISTRATION_NUMBER'] || null,
      dataLocalisation: 'Neon PostgreSQL — EU region (GDPR compliant) + Cloudflare R2',
    };
  }
}
