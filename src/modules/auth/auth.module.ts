import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersModule } from '../users/users.module.js';
import { JwtAuth } from './jwt-auth.js';

@Module({
  providers: [AuthService, PasswordHasher, JwtAuth],
  controllers: [AuthController],
  imports: [UsersModule],
})
export class AuthModule {}
