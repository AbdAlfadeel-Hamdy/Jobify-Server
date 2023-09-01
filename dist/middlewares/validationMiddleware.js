"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginInput = exports.validateUserInput = exports.validateIdParam = exports.validateJobInput = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const JobModel_1 = __importDefault(require("../models/JobModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
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
                if (errorMessages[0].startsWith("Not authorized"))
                    throw new customErrors_1.UnauthorizedError(errorMessages.join(" "));
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
    (0, express_validator_1.param)("id").custom(async (value, { req }) => {
        var _a;
        const isValidId = mongoose_1.default.Types.ObjectId.isValid(value);
        if (!isValidId)
            throw new customErrors_1.BadRequestError("Invalid MongoDB id.");
        const job = await JobModel_1.default.findById(value);
        if (!job)
            throw new customErrors_1.NotFoundError("No job found with this id.");
        const isAdmin = req.user.role === "admin";
        const isOwner = req.user.id === ((_a = job.createdBy) === null || _a === void 0 ? void 0 : _a.toString());
        if (!isAdmin && !isOwner)
            throw new customErrors_1.UnauthorizedError("Not authorized to access this route.");
    }),
]);
exports.validateUserInput = withValidationErrors([
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required."),
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email format.")
        .custom(async (email) => {
        const user = await UserModel_1.default.findOne({ email });
        if (user)
            throw new customErrors_1.BadRequestError("Email already exists.");
    }),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long."),
    (0, express_validator_1.body)("location").notEmpty().withMessage("Location is required."),
    (0, express_validator_1.body)("lastName").notEmpty().withMessage("Last name is required."),
]);
exports.validateLoginInput = withValidationErrors([
    (0, express_validator_1.body)("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email format."),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long."),
]);
