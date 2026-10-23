import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { CredentialsModule } from './credentials.module.js';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [CredentialsModule],
})
export class AuthModule {}
