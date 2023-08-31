import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel";

export const login: Handler = async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};
export const register: Handler = async (req, res, next) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};
