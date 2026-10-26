import { Module } from '@nestjs/common';
import { OtpService } from './otp.service.js';
import { RedisModule } from '../redis/redis.module.js';
import { OtpStore } from './otp.store.js';

@Module({
  providers: [OtpService, OtpStore],
  imports: [RedisModule],
  exports: [OtpService],
})
export class OtpModule {}
