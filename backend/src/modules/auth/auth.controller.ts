import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../../models/User';
import { generateToken } from '../../utils/jwt.util';
import { createdResponse, errorResponse, successResponse } from '../../utils/response.util';
import { UserRole } from '../../constants/enums';

import { AuthRequest } from '../../middleware/auth.middleware';

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginBody {
  email: string;
  password: string;
}

const validateRequest = (req: Request) => {
  return validationResult(req);
};

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validateRequest(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);
    }

    const { name, email, password, role } = req.body as RegisterBody;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || UserRole.SALES,
    });

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return createdResponse(res, 'User registered successfully', { user: userResponse, token });
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validateRequest(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation failed', 400, errors.array()[0].msg);
    }

    const { email, password } = req.body as LoginBody;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return successResponse(res, 'Login successful', { user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const userResponse = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return successResponse(res, 'Profile retrieved successfully', userResponse);
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Internal server error', 500);
  }
};