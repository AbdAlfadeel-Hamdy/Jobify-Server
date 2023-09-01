import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel";

export const getCurrentUser: Handler = async (req: any, res, next) => {
  const user = await User.findById(req.user.id);
  const userWithoutPassword = user?.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};
export const getApplicationStats: Handler = async (req, res, next) => {
  const jobs = await User.countDocuments();
  const users = await User.countDocuments();
  res.status(StatusCodes.OK).json({ jobs, users });
};
export const updateUser: Handler = async (req: any, res, next) => {
  const obj = req.body;
  delete obj.password;
  await User.findByIdAndUpdate(req.user.id, obj);
  res.status(StatusCodes.OK).json({ message: "User updated." });
};
