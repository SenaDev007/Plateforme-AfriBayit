import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

const BLACKLIST_PREFIX = 'jwt:blacklist:';

@Injectable()
export class JwtBlacklistService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  /** Blacklist a JWT token until its expiry */
  async blacklist(jti: string, expiresInSeconds: number): Promise<void> {
    await this.cache.set(`${BLACKLIST_PREFIX}${jti}`, '1', expiresInSeconds * 1000);
  }

  /** Check if a token is blacklisted */
  async isBlacklisted(jti: string): Promise<boolean> {
    const val = await this.cache.get(`${BLACKLIST_PREFIX}${jti}`);
    return val !== null && val !== undefined;
  }
}
