import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
import { UnauthenticatedError } from "../errors/customErrors";
import { createJWT } from "../utils/tokenUtils";

export const register: Handler = async (req, res, next) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  req.body.password = await hashPassword(req.body.password);

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: "User created." });
};

export const login: Handler = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  const isValidUser =
    user &&
    user.name &&
    (await comparePassword(req.body.password, user.password as string));
  if (!isValidUser) throw new UnauthenticatedError("Invalid credentials.");

  const token = await createJWT({ id: user.id, role: user.role });

  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ message: "User logged in." });
};

export const logout: Handler = (req, res, next) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ message: "User logged out." });
};
