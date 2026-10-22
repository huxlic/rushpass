import { Module } from '@nestjs/common';
import { HasherService } from './hasher.service.js';
import { PasswordHasher } from '@nestjs/authentication';

@Module({
  providers: [HasherService, PasswordHasher],
  exports: [HasherService],
})
export class HasherModule {}
