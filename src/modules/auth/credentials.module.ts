import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service.js';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersModule } from '../users/users.module.js';

@Module({
  providers: [CredentialsService, PasswordHasher],
  exports: [CredentialsService],
  imports: [UsersModule],
})
export class CredentialsModule {}
