import { Router } from 'express';
import { register, login, getProfile } from './auth.controller';
import { registerValidation, loginValidation } from './auth.validation';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authenticate, getProfile);

export default router;