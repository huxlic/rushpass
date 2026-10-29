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
import { Mailer } from '@nestjs/mail';
import { EmailVerificationMail } from '../notifications/email-verification.mail.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordHasher: PasswordHasher,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly otpService: OtpService,
    private readonly mailer: Mailer,
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

    const code = await this.otpService.issue(email, 'verify-email');
    this.mailer.send(EmailVerificationMail, {
      to: { name: firstName, address: email },
      data: { code },
    }).catch((err) => console.error(err))
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
    const user = await this.usersService.userOrNull({ email });
    if (user) {
      const code = await this.otpService.issue(email, 'verify-email');

      await this.mailer.send(EmailVerificationMail, {
        to: { name: user.firstName, address: email },
        data: { code },
      });
    }
  }

  async verifyOtp(email: string, code: string): Promise<void> {
    const status = await this.otpService.verify(email, code, 'verify-email');

    switch (status) {
      case 'OK':
        break;
      case 'EXPIRED':
      case 'INVALID':
        throw new BadRequestException('Invalid or expired code', {
          errorCode: 'INVALID_OR_EXPIRED_CODE',
        });
      case 'LOCKED':
        throw new HttpException(
          'Too many requests, request a new code',
          HttpStatus.TOO_MANY_REQUESTS,
          { errorCode: 'LOCKED' },
        );
      default: {
        throw new Error(status);
      }
    }

    await this.usersService.update(
      { email, verifiedAt: null },
      { verifiedAt: new Date() },
    );
  }
}
