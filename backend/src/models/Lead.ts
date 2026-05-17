import mongoose, { Schema, Model } from 'mongoose';
import { ILeadDocument } from '../interfaces/lead.interface';
import { LeadStatus, LeadSource } from '../constants/enums';

const leadSchema = new Schema<ILeadDocument>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [100, 'First name cannot exceed 100 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [100, 'Last name cannot exceed 100 characters'],
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Lead email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, 'Lead source is required'],
    },
    notes: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead owner is required'],
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ owner: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ name: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ owner: 1, status: 1, source: 1 });

const Lead: Model<ILeadDocument> = mongoose.model<ILeadDocument>('Lead', leadSchema);

export default Lead;