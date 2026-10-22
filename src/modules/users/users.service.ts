import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service.js';
import { Prisma, User } from '../../generated/prisma/client.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { HasherService } from '../../common/hasher/hasher.service.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hasherService: HasherService,
  ) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }
  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Omit<User, 'passwordHash'>[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      omit: { passwordHash: true },
    });
  }

  async create(data: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const passwordHash = await this.hasherService.hashPassword(data.password);
    const { firstName, lastName, email } = data;

    try {
      return await this.prisma.user.create({
        data: { firstName, lastName, email, passwordHash },
        omit: { passwordHash: true },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      }
      throw err;
    }
  }
}
