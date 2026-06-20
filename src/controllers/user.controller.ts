import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { sendResponse } from '../utils/response';
import { Prisma } from '@prisma/client';

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      // The request body is typed as Prisma.UserCreateInput
      // Data is passed directly to the service without validation as requested
      const userData: Prisma.UserCreateInput = req.body;

      // Note: we are parsing date strings to Date objects if they come in as strings, 
      // since Prisma expects a Date object for dateOfBirth.
      if (userData.dateOfBirth && typeof userData.dateOfBirth === 'string') {
        userData.dateOfBirth = new Date(userData.dateOfBirth);
      }

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
