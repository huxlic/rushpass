import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, randomInt } from 'node:crypto';
import { OtpPurpose, OtpStore } from './otp.store.js';
import { ConfigService } from '@nestjs/config';

const TTL_SECONDS = 60 * 10;
const MAX_ATTEMPTS = 5;

@Injectable()
export class OtpService {
  constructor(
    private readonly otpStore: OtpStore,
    private readonly configService: ConfigService,
  ) {}
  private hashCode(code: string): string {
    const secret = this.configService.getOrThrow<string>('HMAC_SECRET');
    return createHmac('sha256', secret).update(code).digest('hex');
  }

  async issue(email: string, purpose: OtpPurpose): Promise<string> {
    const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
    await this.otpStore.save(email, this.hashCode(code), TTL_SECONDS, purpose);

    return code;
  }

  async verify(email: string, code: string, purpose: OtpPurpose) {
    const status = await this.otpStore.verify(email, this.hashCode(code), MAX_ATTEMPTS, purpose);
    
    if (status === "EXPIRED") throw new BadRequestException("", {errorCode: "EXPIRED"});
    if (status === "INVALID") throw new BadRequestException("Invalid OTP", {errorCode: "INVALID"})
    if (status === "LOCKED") throw new UnauthorizedException("Limit reached. Try again later", {errorCode: "LOCKED"});
  }
}
