import { Prisma, User } from '@prisma/client';
import { userRepository, UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // Note: Validation is explicitly skipped per requirements.
    return this.repo.create(data);
  }

  async getUsersPaginated(page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const { totalRecords, users } = await this.repo.findManyPaginated(skip, limit);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      users,
      totalRecords,
      totalPages,
      currentPage: page,
    };
  }

  async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.repo.findById(id);
    
    if (!user || user.isDeleted) {
      throw new Error('User not found');
    }

    return this.repo.update(id, data);
  }
}

export const userService = new UserService(userRepository);
