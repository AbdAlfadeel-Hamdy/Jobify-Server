import { Handler, Response, NextFunction } from "express";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customErrors";
import { verifyJWT } from "../utils/tokenUtils";

export const authenticateUser: Handler = (req: any, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError("Authentication failed.");

  try {
    const { id, role } = verifyJWT(token);
    req.user = { id, role };
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
