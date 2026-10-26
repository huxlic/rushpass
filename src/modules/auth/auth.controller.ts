import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { Public } from '@nestjs/authentication';
import { SkipThrottle } from '@nestjs/throttler';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';

@Public()
@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ResponseMessage(
    'User registered successfully. OTP has been sent for verification',
  )
  @Post('/register')
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

  // @Post("/request-otp")
  @ResponseMessage("Email verified")
  @Post('/verify-otp')
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const {email, code} = verifyOtpDto
    return this.authService.verifyOtp(email, code);
  }
}
