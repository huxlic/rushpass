import { User } from '../../generated/prisma/client.js';

export type AuthUser = Omit<User, 'passwordHash'> & { emailVerified: boolean };

// declare module '@nestjs/authentication' {
//   interface AuthenticationTypes {
//     user: AuthUser;
//     refreshTokens: false;
//   }
// }
