import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel";
import { comparePassword, hashPassword } from "../utils/passwordUtils";
import { UnauthenticatedError } from "../errors/customErrors";

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
    user && (await comparePassword(req.body.password, user.password as string));
  if (!isValidUser) throw new UnauthenticatedError("Invalid credentials.");

  res.status(StatusCodes.OK).json({ user });
};
