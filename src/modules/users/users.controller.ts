import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from '../../generated/prisma/client.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  users(): Promise<Omit<User, 'passwordHash'>[]> {
    return this.usersService.users({});
  }

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.usersService.create(createUserDto);
  }
  
  @Get(":id")
  getSingle(@Param("id", new ParseUUIDPipe()) id: string): Promise<Omit<User, 'passwordHash'> | null> {
    return this.usersService.user({ id });
  }
}
