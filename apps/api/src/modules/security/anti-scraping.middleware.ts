import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Section 10.2 — Anti-Scraping & Protection Données Profils
 * Défense multicouche contre le scraping massif (Leçon LinkedIn 700M profils 2021).
 */
@Injectable()
export class AntiScrapingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AntiScrapingMiddleware.name);

  // In-memory rate tracking (production: Redis)
  private requestCounts = new Map<string, { count: number; resetAt: number }>();

  use(req: Request, _res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const ua = req.headers['user-agent'] || '';

    // 10.2.2 — User-Agent suspects
    const suspiciousUAs = ['python-requests', 'scrapy', 'curl/', 'wget/', 'httpclient', 'go-http'];
    if (suspiciousUAs.some((s) => ua.toLowerCase().includes(s))) {
      this.logger.warn(`[AntiScraping] Suspicious UA blocked: ${ua} from ${ip}`);
      _res.status(429).json({ error: 'Accès non autorisé.' });
      return;
    }

    // 10.2.2 — Headless browser detection (basic)
    if (!ua || ua.length < 10) {
      this.logger.warn(`[AntiScraping] Empty/short UA from ${ip}`);
      _res.status(429).json({ error: 'Accès non autorisé.' });
      return;
    }

    // 10.2.1 — Rate check (30 req/min anonymous)
    const now = Date.now();
    const entry = this.requestCounts.get(ip);
    if (entry && entry.resetAt > now) {
      entry.count++;
      if (entry.count > 30) {
        this.logger.warn(`[AntiScraping] Rate limit exceeded: ${ip} (${entry.count} req/min)`);
        _res.status(429).json({ error: 'Trop de requêtes. Réessayez dans 15 minutes.' });
        return;
      }
    } else {
      this.requestCounts.set(ip, { count: 1, resetAt: now + 60_000 });
    }

    // 10.2.2 — Honeypot check (field _hp_trap in body)
    if (req.body && req.body._hp_trap) {
      this.logger.warn(`[AntiScraping] Honeypot triggered from ${ip}`);
      _res.status(403).json({ error: 'Accès interdit.' });
      return;
    }

    next();
  }
}

/**
 * Section 10.2.3 — Protection Données Personnelles des Profils
 */
export class ProfileDataProtection {
  /** Mask email: k***@gmail.com */
  static maskEmail(email: string): string {
    if (!email) return '****';
    const parts = email.split('@');
    if (parts.length < 2) return email;
    const [user, domain] = parts;
    return `${user?.[0] || '*'}***@${domain}`;
  }

  /** Mask phone: never in clear — revealed only after authenticated action */
  static maskPhone(phone: string): string {
    if (!phone || phone.length < 6) return '****';
    return `${phone.slice(0, 3)}***${phone.slice(-2)}`;
  }

  /** Section 10.2.3 — Pagination guard: max 50/page, 500 pages/session */
  static enforcePaginationLimits(page: number, limit: number): { page: number; limit: number } {
    return {
      page: Math.min(Math.max(1, page), 500),
      limit: Math.min(Math.max(1, limit), 50),
    };
  }
}
