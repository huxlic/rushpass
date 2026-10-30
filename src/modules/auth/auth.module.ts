import { Logger, Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PasswordHasher } from '@nestjs/authentication';
import { UsersModule } from '../users/users.module.js';
import { JwtAuth } from './jwt-auth.js';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { OtpModule } from '../otp/otp.module.js';

@Module({
  providers: [
    AuthService,
    PasswordHasher,
    JwtAuth,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    Logger,
  ],
  controllers: [AuthController],
  imports: [UsersModule, OtpModule],
})
export class AuthModule {}
