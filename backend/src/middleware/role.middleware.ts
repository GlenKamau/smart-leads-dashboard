import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { errorResponse } from '../utils/response.util';
import { UserRole } from '../constants/enums';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void | Response => {

    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return errorResponse(res, 'Forbidden: You do not have permission', 403);
    }

    next();
  };
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void | Response => {

  if (!req.user) {
    return errorResponse(res, 'Unauthorized', 401);
  }

  if (req.user.role !== UserRole.ADMIN) {
    return errorResponse(res, 'Admin access required', 403);
  }

  next();
};