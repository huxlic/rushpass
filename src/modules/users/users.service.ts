import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  getAll(): string {
    const user = 'null';

    if (!user) throw new NotFoundException("User not found")

    return 'This action return all users';
  }

  getSingle(id: number): string {
    return `This action returns a #${id} of the user`;
  }

  create(data: CreateUserDto) {
    return data;
  }
}
