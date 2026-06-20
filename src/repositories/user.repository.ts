import prisma from '../database/prisma';
import { Prisma, User } from '@prisma/client';

export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findManyPaginated(skip: number, take: number) {
    const where: Prisma.UserWhereInput = { isDeleted: false };
    
    // Optimize query by running count and fetch in parallel
    const [totalRecords, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { totalRecords, users };
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

export const userRepository = new UserRepository();
