"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.default)();
router.get("/current-user", userController_1.getCurrentUser);
router.get("/admin/app-stats", (0, authMiddleware_1.authorizePermissions)("admin"), userController_1.getApplicationStats);
router.patch("/update-user", validationMiddleware_1.validateUpdateUserInput, userController_1.updateUser);
exports.default = router;
