import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './modules/users/users.module.js';
import { ApiKeyMiddleware } from './middleware/api-key.middleware.js';
import { PrismaModule } from './infra/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AuthenticationModule } from '@nestjs/authentication';
import { OtpModule } from './modules/otp/otp.module.js';
import { minutes, ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from './modules/redis/redis.module.js';
import { ConfigModule } from '@nestjs/config';
import { z } from 'zod';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: z.object({
        PORT: z.coerce.number().default(3000),
        JWT_SECRET: z.string().min(64),
        JWT_ISSUER: z.string().startsWith('http'),
        HMAC_SECRET: z.string().min(10),
      }),
    }),
    AuthenticationModule.forRootAsync({
      useFactory: () => ({
        accessToken: {
          key: process.env.JWT_SECRET!,
          issuer: process.env.JWT_ISSUER!,
          audience: 'rushpass',
          ttl: '15m',
        },
        refreshToken: false,
      }),
    }),
    OtpModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: minutes(10),
          limit: 5,
        },
      ],
    }),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(ApiKeyMiddleware)
      .forRoutes({ path: 'user/:id', method: RequestMethod.GET });
  }
}
