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
import { HasherModule } from './common/hasher/hasher.module.js';

@Module({
  imports: [UsersModule, PrismaModule, HasherModule],
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
