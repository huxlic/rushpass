import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import { OtpService } from '../otp/otp.service.js';

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

    const code = await this.otpService.issue(email, 'verify-email');
    console.log(code);
    
  }

  async login(email: string, password: string) {
    const user = await this.usersService.userOrNull({ email });

    const valid = await this.passwordHasher.verify(
      password,
      user?.passwordHash,
    );

    if (!valid || !user?.passwordHash)
      throw new UnauthorizedException('Invalid credentials', {
        errorCode: 'invalid_credentials',
      });

    if (!user.verifiedAt)
      throw new ForbiddenException(
        'You need to verify your email to perform this action',
        { errorCode: 'email_unverified' },
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
}
