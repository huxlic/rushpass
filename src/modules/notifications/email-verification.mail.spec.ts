import { Test, TestingModule } from '@nestjs/testing';
import { EmailVerificationMail } from './email-verification.mail.js';

describe('EmailVerificationMail', () => {
  let provider: EmailVerificationMail;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailVerificationMail],
    }).compile();

    provider = module.get<EmailVerificationMail>(EmailVerificationMail);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
