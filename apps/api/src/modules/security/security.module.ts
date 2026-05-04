import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtBlacklistService } from './jwt-blacklist.service';
import { TenantGuard } from './tenant.guard';
import { RBACGuard } from './rbac.guard';
import { IncidentResponseService } from './incident-response.service';
import { AntiScrapingMiddleware } from './anti-scraping.middleware';

import { EncryptionService } from './encryption.service';
import { TransactionSecurityService } from './transaction-security.service';

/**
 * Section 10 — Security Module
 * Registers all security services, guards, and middleware.
 */
@Module({
  providers: [
    AuditService,
    JwtBlacklistService,
    TenantGuard,
    RBACGuard,
    IncidentResponseService,
    EncryptionService,
    TransactionSecurityService,
  ],
  exports: [
    AuditService,
    JwtBlacklistService,
    TenantGuard,
    RBACGuard,
    IncidentResponseService,
    EncryptionService,
    TransactionSecurityService,
  ],
})
export class SecurityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Section 10.2 — Anti-scraping on all public routes
    consumer.apply(AntiScrapingMiddleware).forRoutes('*');
  }
}
