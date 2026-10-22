import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';

@Injectable()
export class HasherService {
  constructor(private readonly passwordHasher: PasswordHasher) {}

  async hashPassword(password: string) {
    return this.passwordHasher.hash(password);
  }

  async checkPassword(password: string, storedHash: string | undefined) {
    return this.passwordHasher.verify(password, storedHash);
  }
}
