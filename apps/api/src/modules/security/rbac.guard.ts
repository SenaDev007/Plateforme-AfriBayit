import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Section 10.4 — RBAC AfriBayit Complet
 * 8 rôles hiérarchiques avec portée tenant-isolée.
 */
export enum AfriBayitRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  COUNTRY_ADMIN = 'COUNTRY_ADMIN',
  CERTIFIED_AGENT = 'CERTIFIED_AGENT',
  PREMIUM_AGENT = 'PREMIUM_AGENT',
  ARTISAN_PRO = 'ARTISAN_PRO',
  TRAINER = 'TRAINER',
  USER_STANDARD = 'USER_STANDARD',
  USER_ANONYMOUS = 'USER_ANONYMOUS',
}

/** Section 10.4 — Role hierarchy (higher index = more privileges) */
const ROLE_HIERARCHY: Record<AfriBayitRole, number> = {
  [AfriBayitRole.USER_ANONYMOUS]: 0,
  [AfriBayitRole.USER_STANDARD]: 1,
  [AfriBayitRole.ARTISAN_PRO]: 2,
  [AfriBayitRole.TRAINER]: 2,
  [AfriBayitRole.CERTIFIED_AGENT]: 3,
  [AfriBayitRole.PREMIUM_AGENT]: 4,
  [AfriBayitRole.COUNTRY_ADMIN]: 8,
  [AfriBayitRole.SUPER_ADMIN]: 10,
};

export const ROLES_KEY = 'roles';

/** Decorator to restrict access to specific roles */
export function RequireRoles(...roles: AfriBayitRole[]) {
  return (target: object, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(ROLES_KEY, roles, descriptor.value as object);
    } else {
      Reflect.defineMetadata(ROLES_KEY, roles, target);
    }
    return descriptor ?? target;
  };
}

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AfriBayitRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: string } | undefined;

    if (!user?.role) throw new ForbiddenException('Authentification requise.');

    const userRole = user.role as AfriBayitRole;

    // SUPER_ADMIN bypasses all checks (Section 10.4)
    if (userRole === AfriBayitRole.SUPER_ADMIN) return true;

    // Check if user's role meets minimum required level
    const userLevel = ROLE_HIERARCHY[userRole] ?? 0;
    const minRequired = Math.min(...requiredRoles.map((r) => ROLE_HIERARCHY[r] ?? 0));

    if (userLevel < minRequired) {
      throw new ForbiddenException('Droits insuffisants pour cette action.');
    }

    return true;
  }
}
