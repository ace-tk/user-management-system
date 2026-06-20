import { Prisma, User } from '@prisma/client';
import { userRepository, UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // Note: Validation is explicitly skipped per requirements.
    return this.repo.create(data);
  }
}

export const userService = new UserService(userRepository);
