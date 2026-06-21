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

  async getUsers(req: Request, res: Response) {
    try {
      // Parse query params with fallbacks
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // Sanitize to ensure positive numbers
      const validPage = page > 0 ? page : 1;
      const validLimit = limit > 0 ? limit : 10;

      const result = await userService.getUsersPaginated(validPage, validLimit);

      return sendResponse(res, 200, true, 'Users retrieved successfully', result);
    } catch (error: any) {
      return sendResponse(
        res,
        500,
        false,
        'Failed to retrieve users',
        undefined,
        error.message || 'Internal Server Error'
      );
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const user = await userService.getUserById(id);
      return sendResponse(res, 200, true, 'User retrieved successfully', user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        return sendResponse(res, 404, false, 'User not found');
      }

      return sendResponse(
        res,
        500,
        false,
        'Failed to retrieve user',
        undefined,
        error.message || 'Internal Server Error'
      );
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const userData: Prisma.UserUpdateInput = req.body;

      const user = await userService.updateUser(id, userData);

      return sendResponse(res, 200, true, 'User updated successfully', user);
    } catch (error: any) {
      if (error.message === 'User not found') {
        return sendResponse(res, 404, false, 'User not found');
      }

      return sendResponse(
        res,
        500,
        false,
        'Failed to update user',
        undefined,
        error.message || 'Internal Server Error'
      );
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      await userService.deleteUser(id);

      return sendResponse(res, 200, true, 'User deleted successfully');
    } catch (error: any) {
      if (error.message === 'User not found') {
        return sendResponse(res, 404, false, 'User not found');
      }

      return sendResponse(
        res,
        500,
        false,
        'Failed to delete user',
        undefined,
        error.message || 'Internal Server Error'
      );
    }
  }
}

export const userController = new UserController();
