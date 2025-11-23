import { Injectable } from '@nestjs/common';
import type { Prisma } from 'src/generated/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }
  create(user: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data: user });
  }
}
