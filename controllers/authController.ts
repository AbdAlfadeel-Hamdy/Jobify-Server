import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel";
import { hashPassword } from "../utils/passwordUtils";

export const register: Handler = async (req, res, next) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  req.body.password = await hashPassword(req.body.password);

  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: "User created." });
};

export const login: Handler = async (req, res, next) => {
  const user = await User.findOne();
  res.status(StatusCodes.OK).json({ user });
};
