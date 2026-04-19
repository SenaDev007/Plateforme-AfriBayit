import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { User } from '@afribayit/db';

/** Extracts authenticated user from request — use after JwtAuthGuard */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);
