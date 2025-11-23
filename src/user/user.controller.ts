import { Body, Controller, Post } from '@nestjs/common';
import type { Prisma } from 'src/generated/client';
import type { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: Prisma.UserCreateInput) {
    return this.userService.create(user);
  }
}
