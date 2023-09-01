import Router from "express";
import { ValidationChain } from "express-validator";
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from "../controllers/userController";
import { validateUpdateUserInput } from "../middlewares/validationMiddleware";
import { authorizePermissions } from "../middlewares/authMiddleware";

const router = Router();

router.get("/current-user", getCurrentUser);
router.get(
  "/admin/app-stats",
  authorizePermissions("admin"),
  getApplicationStats
);
router.patch(
  "/update-user",
  validateUpdateUserInput as ValidationChain[],
  updateUser
);

export default router;
