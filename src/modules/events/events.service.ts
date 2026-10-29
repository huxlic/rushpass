import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { Event, Prisma } from '../../generated/prisma/client.js';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.EventUncheckedCreateInput): Promise<Event> {
    return await this.prisma.event.create({
      data: {...data}
    })
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EventWhereUniqueInput;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
  }): Promise<Event[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.event.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findMine(params: {
    skip?: number;
    take?: number;
    where: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return await this.prisma.event.findMany({
      skip,
      take,
      where,
      orderBy,
    });
  }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} event`;
  // }
  //
  // update(id: number, updateEventDto: UpdateEventDto) {
  //   return `This action updates a #${id} event`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} event`;
  // }
}
