import { Module } from '@nestjs/common';
import { EmailVerificationMail } from './email-verification.mail.js';

@Module({
  providers: [EmailVerificationMail],
})
export class NotificationsModule {}
