import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '@afribayit/db';

export const ROLES_KEY = 'roles';

/** Restrict endpoint to specific RBAC roles */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
