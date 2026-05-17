import { Response } from 'express';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  error?: string
): Response => {
  const response: ApiResponse<T> = {
    success: statusCode < 400,
    message,
  };

  if (data) {
    response.data = data;
  }

  if (error) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T
): Response => sendResponse(res, 200, message, data);

export const createdResponse = <T>(
  res: Response,
  message: string,
  data?: T
): Response => sendResponse(res, 201, message, data);

export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: string
): Response => sendResponse(res, statusCode, message, undefined, error);