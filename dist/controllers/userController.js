"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getApplicationStats = exports.getCurrentUser = void 0;
const fs_1 = require("fs");
const http_status_codes_1 = require("http-status-codes");
const cloudinary_1 = require("cloudinary");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const getCurrentUser = async (req, res, next) => {
    const user = await UserModel_1.default.findById(req.user.id);
    const userWithoutPassword = user === null || user === void 0 ? void 0 : user.toJSON();
    res.status(http_status_codes_1.StatusCodes.OK).json({ user: userWithoutPassword });
};
exports.getCurrentUser = getCurrentUser;
const getApplicationStats = async (req, res, next) => {
    const jobs = await UserModel_1.default.countDocuments();
    const users = await UserModel_1.default.countDocuments();
    res.status(http_status_codes_1.StatusCodes.OK).json({ jobs, users });
};
exports.getApplicationStats = getApplicationStats;
const updateUser = async (req, res, next) => {
    const newUser = req.body;
    delete newUser.password;
    if (req.file) {
        const { secure_url, public_id } = await cloudinary_1.v2.uploader.upload(req.file.path);
        await fs_1.promises.unlink(req.file.path);
        newUser.avatar = secure_url;
        newUser.avatarPublicId = public_id;
    }
    const oldUser = await UserModel_1.default.findByIdAndUpdate(req.user.id, newUser);
    if (req.file && (oldUser === null || oldUser === void 0 ? void 0 : oldUser.avatarPublicId)) {
        await cloudinary_1.v2.uploader.destroy(oldUser.avatarPublicId);
    }
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: "User updated successfully" });
};
exports.updateUser = updateUser;
