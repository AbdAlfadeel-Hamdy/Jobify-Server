import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.BAD_REQUEST;
  const message = err.message || "Something went wrong, please try again.";
  res.status(statusCode).json({ message });
};

export default errorHandlerMiddleware;
