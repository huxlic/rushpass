import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  ): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      omit: { passwordHash: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
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
