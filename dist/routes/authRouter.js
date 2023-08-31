"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const router = (0, express_1.default)();
router.post("/login", authController_1.login);
router.post("/register", validationMiddleware_1.validateUserInput, authController_1.register);
exports.default = router;
