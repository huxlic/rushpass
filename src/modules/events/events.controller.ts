import { Body, Controller, Get, Post } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { Event } from '../../generated/prisma/client.js';
import { CurrentUser } from '@nestjs/authentication';
import type { AuthUser } from '../auth/auth-user.js';

// @Public()
@Controller('me/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('create')
  create(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser('id') organizerId: string,
  ): Promise<Event> {
    return this.eventsService.create({ ...createEventDto, organizerId });
  }

  @Get()
  findAll(): Promise<Event[]> {
    return this.eventsService.findAll({});
  }

  @Get()
  findMine(@CurrentUser() user: AuthUser): Promise<Event[]> {
    return this.eventsService.findMine({ where: { organizerId: user.id } });
  }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.eventsService.findOne(+id);
  // }
  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventsService.update(+id, updateEventDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.eventsService.remove(+id);
  // }
}
