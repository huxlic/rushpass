import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client.js';
import { RegisterDto } from './dto/register.dto.js';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly usersService: UsersService,
  ) {}

  async register(data: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    const passwordHash = await this.passwordHasher.hash(data.password);
    const { firstName, lastName, email } = data;

    return this.usersService.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.usersService.userOrNull({ email });

    const valid = await this.passwordHasher.verify(
      password,
      user?.passwordHash,
    );
    if (!valid || !user?.passwordHash)
      throw new BadRequestException('Invalid credentials');

    if (this.passwordHasher.needsRehash(user.passwordHash)) {
      const passwordHash = await this.passwordHasher.hash(password);
      await this.usersService.update({ email }, { passwordHash });
    }

    return user;
  }
}
