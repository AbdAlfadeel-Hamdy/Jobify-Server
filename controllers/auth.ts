import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { UnauthenticatedError } from '../errors/customErrors.js';

// Register
export const register: Handler = async (req, res) => {
  // Set Admin
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';

  await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: 'User created' });
};

// Login
export const login: Handler = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const isValidUser = await user?.checkUserIsValid(req);
  if (!isValidUser) throw new UnauthenticatedError('Invalid credentials');

  await user?.createSendToken(res);
  res.status(StatusCodes.OK).json({ message: 'User logged in' });
};

// Logout
export const logout: Handler = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: true,
    sameSite: 'none',
  });

  res.status(StatusCodes.OK).json({ message: 'User logged out' });
};
