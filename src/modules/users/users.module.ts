import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { PrismaModule } from '../../infra/prisma/prisma.module.js';
import { HasherModule } from '../../common/hasher/hasher.module.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, HasherModule],
})
export class UsersModule {}
