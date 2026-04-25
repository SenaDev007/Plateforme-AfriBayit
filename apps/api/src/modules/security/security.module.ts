import { Global, Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtBlacklistService } from './jwt-blacklist.service';
import { TenantGuard } from './tenant.guard';

@Global()
@Module({
  providers: [AuditService, JwtBlacklistService, TenantGuard],
  exports: [AuditService, JwtBlacklistService, TenantGuard],
})
export class SecurityModule {}
