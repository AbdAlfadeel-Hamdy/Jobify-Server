import { Handler } from "express";
import { UnauthenticatedError } from "../errors/customErrors";
import { verifyJWT } from "../utils/tokenUtils";

export const authenticateUser: Handler = async (req: any, res, next) => {
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
