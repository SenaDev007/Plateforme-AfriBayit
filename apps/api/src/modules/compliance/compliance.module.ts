import { Module } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { LegalFrameworkService } from './legal-framework.service';
import { GDPRComplianceService } from './gdpr-compliance.service';

/**
 * Section 10B — Compliance Module
 * Document validation + Legal framework per country.
 */
@Module({
  providers: [ComplianceService, LegalFrameworkService, GDPRComplianceService],
  exports: [ComplianceService, LegalFrameworkService, GDPRComplianceService],
})
export class ComplianceModule {}
