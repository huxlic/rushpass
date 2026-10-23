import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import { UserRT } from '../users/users.types.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async register(data: RegisterDto): Promise<UserRT> {
    const passwordHash = await this.passwordHasher.hash(data.password);
    const { firstName, lastName, email } = data;

    return this.usersService.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });
  }
  
  async login(email: string, password: string) {
    const user = await this.usersService.userOrNull({ email });

    const valid = await this.passwordHasher.verify(
      password,
      user?.passwordHash,
    );
    
    if (!valid || !user?.passwordHash)
      throw new UnauthorizedException('Invalid credentials');

    if (this.passwordHasher.needsRehash(user.passwordHash)) {
      try {
        const passwordHash = await this.passwordHasher.hash(password);
        await this.usersService.update({ email }, { passwordHash });
      } catch (err) {
        console.error(err);
      }
    }
    return this.tokenService.issue(user.id, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
  }
}
