import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import type { User } from '@afribayit/db';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Omit<User, 'passwordHash' | 'twoFactorSecret'>> {
    const result = await this.authService.login({ email, password });
    if (!result) throw new UnauthorizedException();
    return result.user;
  }
}
