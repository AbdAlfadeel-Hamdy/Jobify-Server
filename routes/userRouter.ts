import Router from "express";
import { ValidationChain } from "express-validator";
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from "../controllers/userController";
import { validateUpdateUserInput } from "../middlewares/validationMiddleware";
import { authorizePermissions } from "../middlewares/authMiddleware";
import upload from "../middlewares/multerMiddleware";

const router = Router();

router.get("/current-user", getCurrentUser);
router.get(
  "/admin/app-stats",
  authorizePermissions("admin"),
  getApplicationStats
);
router.patch(
  "/update-user",
  upload.single("avatar"),
  validateUpdateUserInput as ValidationChain[],
  updateUser
);

export default router;
