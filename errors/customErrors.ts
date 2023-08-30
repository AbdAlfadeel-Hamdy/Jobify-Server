import { StatusCodes } from "http-status-codes";

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string | any[]) {
    super(message as string);
    this.name = "NotFoundError";
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
export class BadRequestError extends Error {
  statusCode: number;
  constructor(message: string | any[]) {
    super(message as string);
    this.name = "BadRequestError";
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
export class UnauthenticatedError extends Error {
  statusCode: number;
  constructor(message: string | any[]) {
    super(message as string);
    this.name = "UnauthenticatedError";
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
export class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message: string | any[]) {
    super(message as string);
    this.name = "UnauthorizedError";
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
