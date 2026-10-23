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

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AuthModule,
    // ConfigModule.forRoot({
    //   isGlobal: true,
    // }),
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
