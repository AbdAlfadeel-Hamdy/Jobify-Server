import Router from 'express';
import rateLimiter from 'express-rate-limit';
import { ValidationChain } from 'express-validator';
import { login, logout, register } from '../controllers/authController.js';
import {
  validateLoginInput,
  validateUserInput,
} from '../middlewares/validationMiddleware.js';

const router = Router();

const apiLimiter = rateLimiter({
  windowMs: 1000 * 60 * 15,
  max: 15,
  message: { message: 'IP rate limit exceeded, try again in 15 minutes' },
});

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
