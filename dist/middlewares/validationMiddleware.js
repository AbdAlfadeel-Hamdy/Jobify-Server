"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const customErrors_1 = require("../errors/customErrors");
const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((err) => err.msg);
                throw new customErrors_1.BadRequestError(errorMessages.join(" "));
            }
            next();
        },
    ];
};
