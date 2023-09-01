import { Request, Response, NextFunction } from "express";
import {
  body,
  param,
  validationResult,
  ValidationChain,
} from "express-validator";
import mongoose from "mongoose";
import Job from "../models/JobModel";
import User from "../models/UserModel";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customErrors";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants";

const withValidationErrors = (validateValues: ValidationChain[]) => {
  return [
    validateValues,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err: any) => err.msg);
        if (errorMessages[0].startsWith("No job"))
          throw new NotFoundError(errorMessages.join(" "));
        if (errorMessages[0].startsWith("Not authorized"))
          throw new UnauthorizedError(errorMessages.join(" "));
        throw new BadRequestError(errorMessages.join(" "));
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("company is required."),
  body("position").notEmpty().withMessage("position is required."),
  body("jobLocation").notEmpty().withMessage("job location is required."),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value."),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type value."),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) throw new BadRequestError("Invalid MongoDB id.");

    const job = await Job.findById(value);
    if (!job) throw new NotFoundError("No job found with this id.");

    const isAdmin = req.user.role === "admin";
    const isOwner = req.user.id === job.createdBy?.toString();

    if (!isAdmin && !isOwner)
      throw new UnauthorizedError("Not authorized to access this route.");
  }),
]);

export const validateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required."),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new BadRequestError("Email already exists.");
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("location").notEmpty().withMessage("Location is required."),
  body("lastName").notEmpty().withMessage("Last name is required."),
]);

export const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
]);

export const validateUpdateUserInput = withValidationErrors([
  body("name").notEmpty().withMessage("Name is required."),
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format.")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.id)
        throw new BadRequestError("Email already exists.");
    }),
  body("location").notEmpty().withMessage("Location is required."),
  body("lastName").notEmpty().withMessage("Last name is required."),
]);
