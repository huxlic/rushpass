import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuth } from './jwt-auth.js';

describe('JwtAuth', () => {
  let provider: JwtAuth;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtAuth],
    }).compile();

    provider = module.get<JwtAuth>(JwtAuth);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
