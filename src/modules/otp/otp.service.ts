import { Injectable } from '@nestjs/common';
import { randomInt } from 'node:crypto';

@Injectable()
export class OtpService {
  issue(email: string) {
    const code = randomInt(1, 1_000_000).toString().padStart(6, '0');
  }

  verify(email: string, code: string) {}
}
