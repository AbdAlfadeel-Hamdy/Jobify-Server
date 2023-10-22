import { Handler, Response, NextFunction } from "express";
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors";
import { verifyJWT } from "../utils/tokenUtils";

export const authenticateUser: Handler = (req: any, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("Authentication failed.");

  try {
    const { id, role } = verifyJWT(token);
    const testUser = id === "653501e317367f4ccd7188ec";
    req.user = { id, role, testUser };
    next();
  } catch (err) {
    throw new UnauthenticatedError("Authentication failed.");
  }
};

export const authorizePermissions = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError("Unauthorized to access this route.");
    next();
  };
};

export const checkForTestUser: Handler = (req: any, res, next) => {
  if (req.user.testUser) throw new BadRequestError("Demo User. Read Only!");
  next();
};
