import { body, param } from 'express-validator';
import { LeadStatus, LeadSource } from '../../constants/enums';

export const createLeadValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ max: 100 })
    .withMessage('First name cannot exceed 100 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ max: 100 })
    .withMessage('Last name cannot exceed 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('position').optional().trim(),
  body('source')
    .notEmpty()
    .withMessage('Source is required')
    .isIn(Object.values(LeadSource))
    .withMessage('Invalid source'),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage('Invalid status'),
  body('notes').optional().trim(),
];

export const updateLeadValidation = [
  param('id')
    .notEmpty()
    .withMessage('Lead ID is required')
    .isMongoId()
    .withMessage('Invalid lead ID'),
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty')
    .isLength({ max: 100 }),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty')
    .isLength({ max: 100 }),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone').optional().trim(),
  body('company').optional().trim(),
  body('position').optional().trim(),
  body('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage('Invalid source'),
  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage('Invalid status'),
  body('notes').optional().trim(),
];

export const leadIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Lead ID is required')
    .isMongoId()
    .withMessage('Invalid lead ID'),
];