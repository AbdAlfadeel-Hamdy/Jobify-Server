import { Handler, Response, NextFunction } from 'express';
import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../errors/customErrors.js';
import { verifyJWT } from '../utils/token.js';

// Authenticate user
export const authenticateUser: Handler = (req: any, res, next) => {
  const { token } = req.cookies;
  if (!token) throw new UnauthenticatedError('Authentication failed.');
  try {
    const { id, role } = verifyJWT(token);
    // Check for Test User
    const testUser = id === '653518deac892e5109a854fb';
    req.user = { id, role, testUser };
    next();
  } catch (err) {
    throw new UnauthenticatedError('Authentication failed.');
  }
};

// Authorize Permissions
export const authorizePermissions = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError('Unauthorized to access this route.');
    next();
  };
};

// Check for Test User
export const checkForTestUser: Handler = (req: any, res, next) => {
  if (req.user.testUser) throw new BadRequestError('Demo User. Read Only!');
  next();
};
