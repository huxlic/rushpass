import { Injectable } from '@nestjs/common';
import { Mailable } from '@nestjs/mail';

interface EmailVerification {
  code: string;
}

@Injectable()
export class EmailVerificationMail implements Mailable<EmailVerification> {
  render({ code }: EmailVerification) {
    return {
      subject: 'Account verification',
      template: 'email-verification',
      context: {
        code,
      },
    };
  }
}
