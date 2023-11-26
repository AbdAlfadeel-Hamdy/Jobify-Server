import Router from 'express';
import rateLimiter from 'express-rate-limit';
import { ValidationChain } from 'express-validator';
import { login, logout, register } from '../controllers/auth.js';
import {
  validateLoginInput,
  validateUserInput,
} from '../middlewares/validation.js';

// Rate Limiter
const apiLimiter = rateLimiter({
  windowMs: 1000 * 60 * 15,
  max: 15,
  message: { message: 'IP rate limit exceeded, try again in 15 minutes' },
});

const router = Router();

router.post(
  '/register',
  apiLimiter,
  validateUserInput as ValidationChain[],
  register
);
router.post(
  '/login',
  apiLimiter,
  validateLoginInput as ValidationChain[],
  login
);
router.get('/logout', logout);

export default router;
