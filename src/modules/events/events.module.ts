import { Module } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventsController } from './events.controller.js';
import { PrismaModule } from '../../infra/prisma/prisma.module.js';

@Module({
  controllers: [EventsController],
  providers: [EventsService],
  imports: [PrismaModule]
})
export class EventsModule {}
