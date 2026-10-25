import { Inject, Injectable } from '@nestjs/common';
import { REDIS_CLIENT, type RedisClient } from '../redis/redis.module.js';

export type OtpPurpose = 'verify-email' | 'reset-password';
const OTP_VERIFY_RESULTS = ['OK', 'EXPIRED', 'INVALID', 'LOCKED'] as const;
export type OtpVerifyResult = (typeof OTP_VERIFY_RESULTS)[number];

const VERIFY_SCRIPT = `
local stored = redis.call('HGET', KEYS[1], 'hash')
if not stored then return 'EXPIRED' end

local attempts = redis.call('HINCRBY', KEYS[1], 'attempts', 1)

if stored == ARGV[1] then
  redis.call('DEL', KEYS[1])
  return 'OK'
end

if attempts >= tonumber(ARGV[2]) then
  redis.call('DEL', KEYS[1])
  return 'LOCKED'
end

return 'INVALID'
`;

@Injectable()
export class OtpStore {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}

  private key(purpose: OtpPurpose, email: string): string {
    return `otp:${purpose}:${email}`;
  }

  async save(email: string, hash: string, ttlSeconds: number, purpose: OtpPurpose): Promise<void> {
    const key = this.key(purpose, email);

    await this.redis
      .multi()
      .hSet(key, {
        hash,
        attempts: 0,
      })
      .expire(key, ttlSeconds)
      .exec();
  }

  async verify(
    email: string,
    hash: string,
    maxAttempts: number,
    purpose: OtpPurpose,
  ): Promise<OtpVerifyResult> {
    const result = await this.redis.eval(VERIFY_SCRIPT, {
      keys: [this.key(purpose, email)],
      arguments: [hash, String(maxAttempts)],
    });

    if (!OTP_VERIFY_RESULTS.includes(result as OtpVerifyResult)) {
      throw new Error(`Unexpected OTP verify result: ${String(result)}`);
    }

    return result as OtpVerifyResult;
  }

  async remove(email: string, purpose: OtpPurpose): Promise<void> {
    const key = this.key(purpose, email);
    await this.redis.delete(key);
  }
}
