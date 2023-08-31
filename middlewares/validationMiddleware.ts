import { Request, Response, NextFunction } from "express";
import {
  body,
  param,
  query,
  validationResult,
  ValidationChain,
} from "express-validator";
import { BadRequestError } from "../errors/customErrors";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants";
import mongoose from "mongoose";

const withValidationErrors = (validateValues: ValidationChain[]) => {
  return [
    validateValues,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((err: any) => err.msg);
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
  param("id")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid MongoDB id."),
]);
