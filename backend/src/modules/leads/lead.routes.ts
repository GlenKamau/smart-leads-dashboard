import { Router } from 'express';
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
  getLeadStats,
} from './lead.controller';
import {
  createLeadValidation,
  updateLeadValidation,
  leadIdValidation,
} from './lead.validation';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/stats', authenticate, getLeadStats);
router.post('/', authenticate, createLeadValidation, createLead);
router.get('/', authenticate, getAllLeads);
router.get('/export', authenticate, exportLeads);
router.get('/:id', authenticate, leadIdValidation, getLeadById);
router.put('/:id', authenticate, updateLeadValidation, updateLead);
router.delete('/:id', authenticate, leadIdValidation, deleteLead);

export default router;
