"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || http_status_codes_1.StatusCodes.BAD_REQUEST;
    const message = err.message || "Something went wrong, please try again.";
    res.status(statusCode).json({ message });
};
exports.default = errorHandlerMiddleware;
