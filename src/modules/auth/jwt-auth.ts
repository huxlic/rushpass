import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  JwtClaims,
} from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import { UserRT } from '../users/users.types.js';

@Injectable()
export class JwtAuth extends JwtBearerProvider<UserRT> {
  constructor(
    private readonly usersService: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super({ realm: 'rushpass' });
    registry.registerProvider(this);
  }

  async validate({ sub }: JwtClaims) {
    if (!sub) return null;
    const user = await this.usersService.user({ id: sub });
    return user ? { ...user, emailVerified: !!user.verifiedAt } : null;
  }
}
