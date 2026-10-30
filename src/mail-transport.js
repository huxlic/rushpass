import { FileMailTransport, ResendTransport, SmtpTransport, } from '@nestjs/mail';
import { readFileSync } from 'node:fs';
export function mailTransport(env = process.env) {
    switch (env.MAIL_TRANSPORT ?? 'file') {
        case 'file':
            return new FileMailTransport({
                directory: env.MAIL_DIRECTORY ?? 'var/mail',
            });
        case 'smtp':
            return new SmtpTransport({
                url: required(env, 'SMTP_URL'),
                pool: true,
                ...(env.SMTP_CA_FILE && {
                    tls: { ca: readFileSync(env.SMTP_CA_FILE) },
                }),
            });
        case 'resend':
            return new ResendTransport({ apiKey: required(env, 'RESEND_API_KEY') });
        default:
            throw new Error(`MAIL_TRANSPORT must be "file", "smtp" or "resend" (got "${env.MAIL_TRANSPORT}")`);
    }
}
function required(env, name) {
    const value = env[name];
    if (!value) {
        throw new Error(`${name} is required when MAIL_TRANSPORT is "${env.MAIL_TRANSPORT}"`);
    }
    return value;
}
//# sourceMappingURL=mail-transport.js.map