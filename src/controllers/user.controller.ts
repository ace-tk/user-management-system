import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { sendResponse } from '../utils/response';
import { Prisma } from '@prisma/client';

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      // The request body is typed and parsed by Zod middleware
      const userData: Prisma.UserCreateInput = req.body;

      const user = await userService.createUser(userData);
      
      return sendResponse(res, 201, true, 'User created successfully', user);
    } catch (error: any) {
      // Basic error handling (e.g., Prisma unique constraint violations)
      return sendResponse(
        res, 
        500, 
        false, 
        'Failed to create user', 
        undefined, 
        error.message || 'Internal Server Error'
      );
    }
  }
}

export const userController = new UserController();
