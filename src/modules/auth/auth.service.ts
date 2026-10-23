import { Injectable } from '@nestjs/common';
import { User } from '../../generated/prisma/client.js';
import { RegisterDto } from './dto/register.dto.js';
import { CredentialsService } from './credentials.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly credentialsService: CredentialsService) {}

  register(data: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    return this.credentialsService.register(data);
  }

  login(email: string, password: string) {
    return this.credentialsService.login(email, password);
  }
}
