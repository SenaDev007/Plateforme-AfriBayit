import { Module } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { LegalFrameworkService } from './legal-framework.service';

/**
 * Section 10B — Compliance Module
 * Document validation + Legal framework per country.
 */
@Module({
  providers: [ComplianceService, LegalFrameworkService],
  exports: [ComplianceService, LegalFrameworkService],
})
export class ComplianceModule {}
