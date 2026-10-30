import {
  FileMailTransport,
  ResendTransport,
  SmtpTransport,
  type MailTransport,
} from '@nestjs/mail';
import { readFileSync } from 'node:fs';

/**
 * The transport for this environment: `file` in development (the default), `smtp` or
 * `resend` in production. Missing settings fail at startup, naming the variable.
 */
export function mailTransport(
  env: NodeJS.ProcessEnv = process.env,
): MailTransport {
  switch (env.MAIL_TRANSPORT ?? 'file') {
    case 'file':
      return new FileMailTransport({
        directory: env.MAIL_DIRECTORY ?? 'var/mail',
      });
    case 'smtp':
      return new SmtpTransport({
        url: required(env, 'SMTP_URL'), // smtp://user:password@smtp.example.com:587
        pool: true,
        // A private CA, e.g. for a relay inside the company network
        ...(env.SMTP_CA_FILE && {
          tls: { ca: readFileSync(env.SMTP_CA_FILE) },
        }),
      });
    case 'resend':
      return new ResendTransport({ apiKey: required(env, 'RESEND_API_KEY') });
    default:
      throw new Error(
        `MAIL_TRANSPORT must be "file", "smtp" or "resend" (got "${env.MAIL_TRANSPORT}")`,
      );
  }
}

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (!value) {
    throw new Error(
      `${name} is required when MAIL_TRANSPORT is "${env.MAIL_TRANSPORT}"`,
    );
  }
  return value;
}
