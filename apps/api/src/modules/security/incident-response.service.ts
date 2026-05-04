import { Injectable, Logger } from '@nestjs/common';

/**
 * Section 10.7 — Monitoring & Incident Response Service
 * Plan de Réponse aux Incidents (PRI) : Détection < 5min, Confinement < 15min,
 * Analyse < 2h, Remédiation < 24h, Communication < 72h, Post-mortem < 7j
 */

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentPhase =
  | 'DETECTION'
  | 'CONTAINMENT'
  | 'ANALYSIS'
  | 'REMEDIATION'
  | 'COMMUNICATION'
  | 'POSTMORTEM';

export interface SecurityIncident {
  id: string;
  type: string;
  severity: IncidentSeverity;
  phase: IncidentPhase;
  description: string;
  affectedUsers: number;
  detectedAt: Date;
  containedAt?: Date;
  resolvedAt?: Date;
  metadata: Record<string, unknown>;
}

/** Section 10.7 SLA targets */
const SLA_TARGETS: Record<IncidentPhase, number> = {
  DETECTION: 5 * 60_000, // 5 min
  CONTAINMENT: 15 * 60_000, // 15 min
  ANALYSIS: 2 * 3600_000, // 2 hours
  REMEDIATION: 24 * 3600_000, // 24 hours
  COMMUNICATION: 72 * 3600_000, // 72 hours (RGPD)
  POSTMORTEM: 7 * 86400_000, // 7 days
};

@Injectable()
export class IncidentResponseService {
  private readonly logger = new Logger(IncidentResponseService.name);

  /** Section 10.7 — Auto-detection thresholds */
  async evaluateThreshold(event: {
    type: string;
    count: number;
    windowMinutes: number;
    ip?: string;
    userId?: string;
  }): Promise<{ shouldAlert: boolean; severity: IncidentSeverity; action: string }> {
    // Auth failures (Section 10.7 — > 5 in 1min)
    if (event.type === 'AUTH_FAILURE' && event.count > 5 && event.windowMinutes <= 1) {
      return { shouldAlert: true, severity: 'HIGH', action: 'BLOCK_IP_15MIN' };
    }
    // Cross-tenant attempt (Section 10.7 — 1 single attempt)
    if (event.type === 'CROSS_TENANT_ATTEMPT') {
      return { shouldAlert: true, severity: 'CRITICAL', action: 'BLOCK_AND_ALERT_SUPER_ADMIN' };
    }
    // Scraping detected (Section 10.7 — > 200 req/min)
    if (event.type === 'SCRAPING' && event.count > 200 && event.windowMinutes <= 1) {
      return { shouldAlert: true, severity: 'HIGH', action: 'CLOUDFLARE_BLACKLIST' };
    }
    // Anomalous transaction (Section 10.7 — ML score > 0.85)
    if (event.type === 'TRANSACTION_ANOMALY') {
      return { shouldAlert: true, severity: 'CRITICAL', action: 'SUSPEND_AND_FREEZE_ESCROW' };
    }
    // Upload suspect (Section 10.7 — magic bytes invalid or virus)
    if (event.type === 'UPLOAD_SUSPECT') {
      return { shouldAlert: true, severity: 'MEDIUM', action: 'REJECT_AND_LOG' };
    }
    // Error 500 massive (Section 10.7 — > 10 in 5min)
    if (event.type === 'ERROR_500' && event.count > 10 && event.windowMinutes <= 5) {
      return { shouldAlert: true, severity: 'CRITICAL', action: 'SLACK_SMS_CTO_ROLLBACK' };
    }
    // Prompt injection (Section 10.7)
    if (event.type === 'PROMPT_INJECTION') {
      return { shouldAlert: true, severity: 'MEDIUM', action: 'BLOCK_NEUTRAL_RESPONSE' };
    }
    // Bulk download (Section 10.7 — > 50 docs/hour)
    if (event.type === 'BULK_DOWNLOAD' && event.count > 50) {
      return { shouldAlert: true, severity: 'HIGH', action: 'SUSPEND_AND_REVIEW' };
    }

    return { shouldAlert: false, severity: 'LOW', action: 'NONE' };
  }

  /** Section 10.7 — Check SLA compliance */
  checkSLACompliance(incident: SecurityIncident): {
    inSLA: boolean;
    currentPhaseDeadline: Date;
    elapsedMs: number;
  } {
    const targetMs = SLA_TARGETS[incident.phase];
    const elapsedMs = Date.now() - incident.detectedAt.getTime();
    return {
      inSLA: elapsedMs <= targetMs,
      currentPhaseDeadline: new Date(incident.detectedAt.getTime() + targetMs),
      elapsedMs,
    };
  }
}
