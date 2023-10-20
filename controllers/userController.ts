import { Handler } from "express";
import { promises as fs } from "fs";
import { StatusCodes } from "http-status-codes";
import { v2 as cloudinary } from "cloudinary";
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
  const newUser = req.body;
  delete newUser.password;
  if (req.file) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path
    );
    await fs.unlink(req.file.path);
    newUser.avatar = secure_url;
    newUser.avatarPublicId = public_id;
  }
  const oldUser = await User.findByIdAndUpdate(req.user.id, newUser);
  if (req.file && oldUser?.avatarPublicId) {
    await cloudinary.uploader.destroy(oldUser.avatarPublicId);
  }
  res.status(StatusCodes.OK).json({ message: "User updated successfully" });
};
