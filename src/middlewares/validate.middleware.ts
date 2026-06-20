import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { sendResponse } from '../utils/response';

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and coerce request body against the schema
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod errors into a structured object array
        const formattedErrors = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return sendResponse(
          res,
          400,
          false,
          'Validation Error',
          undefined,
          formattedErrors
        );
      }
      return sendResponse(res, 500, false, 'Internal Server Error', undefined, error);
    }
  };
};
