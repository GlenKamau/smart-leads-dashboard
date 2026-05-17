import { LeadStatus, LeadSource } from '../constants/enums';
import { Document, Types } from 'mongoose';

export interface ILead {
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILeadDocument extends Omit<ILead, '_id' | 'owner'>, Document<Types.ObjectId> {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
}

export interface ILeadResponse {
  id: string;
  _id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
}