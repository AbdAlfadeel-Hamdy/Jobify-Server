import Router from "express";
import { login, register } from "../controllers/authController";
import { validateUserInput } from "../middlewares/validationMiddleware";

const router = Router();

router.post("/login", login);
router.post("/register", validateUserInput as any, register);

export default router;
