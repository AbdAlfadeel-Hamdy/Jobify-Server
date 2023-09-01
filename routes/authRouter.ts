import Router from "express";
import { ValidationChain } from "express-validator";
import { login, logout, register } from "../controllers/authController";
import {
  validateLoginInput,
  validateUserInput,
} from "../middlewares/validationMiddleware";

const router = Router();

router.post("/register", validateUserInput as ValidationChain[], register);
router.post("/login", validateLoginInput as ValidationChain[], login);
router.get("/logout", logout);

export default router;
