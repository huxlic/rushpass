import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from '../../generated/prisma/client.js';
import { RoleGuard } from '../../guards/role.guard.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  @UseGuards(RoleGuard)
  @ResponseMessage("All users retrieved")
  users(): Promise<Omit<User, 'passwordHash'>[]> {
    return this.usersService.users({});
  }

  @Get(':id')
  getSingle(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Omit<User, 'passwordHash'> | null> {
    return this.usersService.user({ id });
  }
}
