import { Request, Response, NextFunction } from "express";
import { body, validationResult, ValidationChain } from "express-validator";
import { BadRequestError } from "../errors/customErrors";

const withValidationErrors = (validateValues: ValidationChain) => {
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
