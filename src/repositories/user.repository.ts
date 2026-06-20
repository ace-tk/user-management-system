import prisma from '../database/prisma';
import { Prisma, User } from '@prisma/client';

export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }
}

export const userRepository = new UserRepository();
