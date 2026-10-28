import { Test, TestingModule } from '@nestjs/testing';
import { OtpService } from './otp.service.js';
import { OtpStore } from './otp.store.js';
import { RedisModule } from '../../infra/redis/redis.module.js';

describe('OtpService', () => {
  let service: OtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpService, OtpStore],
      imports: [RedisModule],
      exports: [OtpService],
    }).compile();

    service = module.get<OtpService>(OtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
