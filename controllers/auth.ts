import { Handler } from 'express';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { UnauthenticatedError } from '../errors/customErrors.js';
import { createJWT } from '../utils/token.js';

// Register
export const register: Handler = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';

  req.body.password = await hashPassword(req.body.password);

  await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ message: 'User created.' });
};

// Login
export const login: Handler = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  const isValidUser =
    user &&
    user.name &&
    (await comparePassword(req.body.password, user.password as string));
  if (!isValidUser) throw new UnauthenticatedError('Invalid credentials.');

  const token = await createJWT({ id: user.id, role: user.role });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    sameSite: 'none',
  });

  res.status(StatusCodes.OK).json({ message: 'User logged in.' });
};

// Logout
export const logout: Handler = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: true,
    sameSite: 'none',
  });

  res.status(StatusCodes.OK).json({ message: 'User logged out.' });
};
