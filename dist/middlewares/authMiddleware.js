"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizePermissions = exports.authenticateUser = void 0;
const customErrors_1 = require("../errors/customErrors");
const tokenUtils_1 = require("../utils/tokenUtils");
const authenticateUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token)
        throw new customErrors_1.UnauthenticatedError("Authentication failed.");
    try {
        const { id, role } = (0, tokenUtils_1.verifyJWT)(token);
        req.user = { id, role };
        next();
    }
    catch (err) {
        throw new customErrors_1.UnauthenticatedError("Authentication failed.");
    }
};
exports.authenticateUser = authenticateUser;
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            throw new customErrors_1.UnauthorizedError("Unauthorized to access this route.");
        next();
    };
};
exports.authorizePermissions = authorizePermissions;
