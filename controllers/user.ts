import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/User.js';
import { formatImage } from '../middlewares/multer.js';

// Get Current User Info
export const getCurrentUser: Handler = async (req: any, res, next) => {
  const user = await User.findById(req.user.id);
  const userWithoutPassword = user?.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

// Calculate number of jobs and users
export const getApplicationStats: Handler = async (req, res, next) => {
  const jobs = await User.countDocuments();
  const users = await User.countDocuments();
  res.status(StatusCodes.OK).json({ jobs, users });
};

// Update User (not including password)
export const updateUser: Handler = async (req: any, res, next) => {
  const newUser = req.body;
  delete newUser.password;
  // Upload User Avatar
  if (req.file) {
    const file = formatImage(req.file);
    if (file) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(file);
      newUser.avatar = secure_url;
      // Needed to allow deleting old image on update avatar
      newUser.avatarPublicId = public_id;
    }
  }

  const oldUser = await User.findByIdAndUpdate(req.user.id, newUser);

  // Delete old image on Cloudinary on update avatar
  if (req.file && oldUser?.avatarPublicId)
    await cloudinary.uploader.destroy(oldUser.avatarPublicId);

  res.status(StatusCodes.OK).json({ message: 'User updated successfully' });
};
