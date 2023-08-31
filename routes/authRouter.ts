import Router from "express";
import { login, register } from "../controllers/authController";
import {
  validateLoginInput,
  validateUserInput,
} from "../middlewares/validationMiddleware";

const router = Router();

router.post("/login", validateLoginInput as any, login);
router.post("/register", validateUserInput as any, register);

export default router;
