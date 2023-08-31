"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const UserModel_1 = __importDefault(require("../models/UserModel"));
const passwordUtils_1 = require("../utils/passwordUtils");
const customErrors_1 = require("../errors/customErrors");
const register = async (req, res, next) => {
    const isFirstAccount = (await UserModel_1.default.countDocuments()) === 0;
    req.body.role = isFirstAccount ? "admin" : "user";
    req.body.password = await (0, passwordUtils_1.hashPassword)(req.body.password);
    const user = await UserModel_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ message: "User created." });
};
exports.register = register;
const login = async (req, res, next) => {
    const user = await UserModel_1.default.findOne({ email: req.body.email });
    const isValidUser = user && (await (0, passwordUtils_1.comparePassword)(req.body.password, user.password));
    if (!isValidUser)
        throw new customErrors_1.UnauthenticatedError("Invalid credentials.");
    res.status(http_status_codes_1.StatusCodes.OK).json({ user });
};
exports.login = login;
