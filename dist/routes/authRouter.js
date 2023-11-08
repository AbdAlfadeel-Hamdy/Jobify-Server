"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authController_1 = require("../controllers/authController");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const router = (0, express_1.default)();
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1000 * 60 * 15,
    max: 15,
    message: { message: "IP rate limit exceeded, try again in 15 minutes" },
});
router.post("/register", apiLimiter, validationMiddleware_1.validateUserInput, authController_1.register);
router.post("/login", apiLimiter, validationMiddleware_1.validateLoginInput, authController_1.login);
router.get("/logout", authController_1.logout);
exports.default = router;
