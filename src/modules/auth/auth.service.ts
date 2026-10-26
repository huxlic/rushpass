import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import {
  PasswordHasher,
  TokenPair,
  TokenService,
} from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import { OtpService } from '../otp/otp.service.js';
import { email } from 'zod';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
  ) {}

  async register(data: RegisterDto): Promise<void> {
    const passwordHash = await this.passwordHasher.hash(data.password);
    const { firstName, lastName, email } = data;

    await this.usersService.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    await this.otpService.issue(email, 'verify-email');
  }

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.usersService.userOrNull({ email });

    const valid = await this.passwordHasher.verify(
      password,
      user?.passwordHash,
    );

    if (!valid || !user?.passwordHash)
      throw new UnauthorizedException('Invalid credentials', {
        errorCode: 'INVALID_CREDENTIALS',
      });

    if (!user.verifiedAt)
      throw new ForbiddenException(
        'You need to verify your email to perform this action',
        { errorCode: 'EMAIL_UNVERIFIED' },
      );

    if (this.passwordHasher.needsRehash(user.passwordHash)) {
      try {
        const passwordHash = await this.passwordHasher.hash(password);
        await this.usersService.update({ email }, { passwordHash });
      } catch (err) {
        console.error(err);
      }
    }
    return this.tokenService.issue(user.id, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
  }

  async requestOtp(email: string): Promise<void> {
    await this.otpService.issue(email, 'verify-email');
  }

  async verifyOtp(email: string, code: string): Promise<void> {
    const status = await this.otpService.verify(email, code, 'verify-email');

    if (status === 'EXPIRED' || status === 'INVALID')
      throw new BadRequestException('Invalid or expired code', {
        errorCode: 'INVALID_OR_EXPIRED_CODE',
      });
    
    if (status === 'LOCKED')
      throw new HttpException(
        'Too many attempts, request a new code',
        HttpStatus.TOO_MANY_REQUESTS,
        { errorCode: 'LOCKED' },
      );

    await this.usersService.update(
      { email, verifiedAt: null },
      { verifiedAt: new Date() },
    );
  }
}
