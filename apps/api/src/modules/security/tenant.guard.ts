import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

export const TENANT_KEY = 'tenant';

/** Decorate a controller or route to specify which countries/tenants are allowed */
export function TenantAccess(...countries: string[]) {
  return (target: object, key?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(TENANT_KEY, countries, descriptor.value as object);
    } else {
      Reflect.defineMetadata(TENANT_KEY, countries, target);
    }
    return descriptor ?? target;
  };
}

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedTenants = this.reflector.getAllAndOverride<string[] | undefined>(TENANT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!allowedTenants || allowedTenants.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'] as { country?: string; role?: string } | undefined;

    if (!user) return false;

    if (user.role === 'SUPER_ADMIN') return true;

    const userCountry = user.country ?? (request.headers['x-tenant-id'] as string | undefined);
    if (!userCountry) throw new ForbiddenException('Tenant non identifié.');

    if (!allowedTenants.includes(userCountry)) {
      throw new ForbiddenException(`Accès refusé pour le tenant : ${userCountry}`);
    }

    return true;
  }
}
