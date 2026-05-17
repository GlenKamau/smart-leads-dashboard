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
import { authorize } from '../../middleware/role.middleware';
import { UserRole } from '../../constants/enums';

const router = Router();

router.get('/stats', authenticate, authorize(UserRole.ADMIN, UserRole.SALES), getLeadStats);
router.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.SALES), createLeadValidation, createLead);
router.get('/', authenticate, authorize(UserRole.ADMIN, UserRole.SALES), getAllLeads);
router.get('/export', authenticate, authorize(UserRole.ADMIN, UserRole.SALES), exportLeads);
router.get('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.SALES), leadIdValidation, getLeadById);
router.put('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.SALES), updateLeadValidation, updateLead);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.SALES), leadIdValidation, deleteLead);

export default router;
