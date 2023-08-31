"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdParam = exports.validateJobInput = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const JobModel_1 = __importDefault(require("../models/JobModel"));
const customErrors_1 = require("../errors/customErrors");
const constants_1 = require("../utils/constants");
const withValidationErrors = (validateValues) => {
    return [
        validateValues,
        (req, res, next) => {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorMessages = errors.array().map((err) => err.msg);
                if (errorMessages[0].startsWith("No job"))
                    throw new customErrors_1.NotFoundError(errorMessages.join(" "));
                throw new customErrors_1.BadRequestError(errorMessages.join(" "));
            }
            next();
        },
    ];
};
exports.validateJobInput = withValidationErrors([
    (0, express_validator_1.body)("company").notEmpty().withMessage("company is required."),
    (0, express_validator_1.body)("position").notEmpty().withMessage("position is required."),
    (0, express_validator_1.body)("jobLocation").notEmpty().withMessage("job location is required."),
    (0, express_validator_1.body)("jobStatus")
        .isIn(Object.values(constants_1.JOB_STATUS))
        .withMessage("invalid status value."),
    (0, express_validator_1.body)("jobType")
        .isIn(Object.values(constants_1.JOB_TYPE))
        .withMessage("invalid type value."),
]);
exports.validateIdParam = withValidationErrors([
    (0, express_validator_1.param)("id").custom(async (value) => {
        const isValidId = mongoose_1.default.Types.ObjectId.isValid(value);
        if (!isValidId)
            throw new customErrors_1.BadRequestError("Invalid MongoDB id.");
        const job = await JobModel_1.default.findById(value);
        if (!job)
            throw new customErrors_1.NotFoundError("No job found with this id.");
    }),
]);
