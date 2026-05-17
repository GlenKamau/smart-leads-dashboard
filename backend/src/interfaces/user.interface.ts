import { UserRole } from '../constants/enums';
import { Document, Types } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends Omit<IUser, '_id'>, Document<Types.ObjectId> {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}