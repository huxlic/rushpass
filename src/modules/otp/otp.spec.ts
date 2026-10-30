import { Test, TestingModule } from '@nestjs/testing';
import { OtpStore } from './otp.store.js';

describe('OtpStore', () => {
  let provider: OtpStore;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OtpStore],
    }).compile();

    provider = module.get<OtpStore>(OtpStore);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
