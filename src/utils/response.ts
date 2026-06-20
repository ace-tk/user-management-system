import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  error?: any
) => {
  const response: ApiResponse<T> = {
    success,
    message,
  };

  if (data !== undefined) response.data = data;
  if (error !== undefined) response.error = error;

  return res.status(statusCode).json(response);
};
