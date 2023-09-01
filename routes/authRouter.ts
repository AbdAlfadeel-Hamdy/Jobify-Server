import Router from "express";
import { login, logout, register } from "../controllers/authController";
import {
  validateLoginInput,
  validateUserInput,
} from "../middlewares/validationMiddleware";

const router = Router();

router.post("/register", validateUserInput as any, register);
router.post("/login", validateLoginInput as any, login);
router.get("/logout", logout);

export default router;
