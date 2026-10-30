import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { Public } from '@nestjs/authentication';
import { minutes, SkipThrottle, Throttle } from '@nestjs/throttler';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { RequestOtpDto } from './dto/request-otp.dto.js';

@Public()
@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ResponseMessage(
    'User registered successfully. OTP has been sent for verification',
  )
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login successful')
  login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.login(email, password);
  }

  @Throttle({ default: { limit: 1, ttl: minutes(1) } })
  @SkipThrottle({ default: false })
  @HttpCode(HttpStatus.OK)
  @Post('/request-otp')
  @ResponseMessage(
    'If the account exist, an OTP has been sent for verification',
  )
  requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    const { email } = requestOtpDto;
    return this.authService.requestOtp(email);
  }

  @SkipThrottle({ default: false })
  @Post('/verify-otp')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Email verified')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { email, code } = verifyOtpDto;
    return this.authService.verifyOtp(email, code);
  }
}
