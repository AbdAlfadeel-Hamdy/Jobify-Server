import Router from 'express';
import { ValidationChain } from 'express-validator';
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from '../controllers/user.js';
import { validateUpdateUserInput } from '../middlewares/validation.js';
import { authorizePermissions, checkForTestUser } from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';

const router = Router();

router.get('/current-user', getCurrentUser);
router.get(
  '/admin/app-stats',
  authorizePermissions('admin'),
  getApplicationStats
);
router.patch(
  '/update-user',
  checkForTestUser,
  upload.single('avatar'),
  validateUpdateUserInput as ValidationChain[],
  updateUser
);

export default router;
