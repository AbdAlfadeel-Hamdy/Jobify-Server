import { Request, Response } from 'express';
import { Schema, Model, model } from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password.js';
import { createJWT } from '../utils/token.js';

interface IUser {
  name: string;
  email: string;
  password: string;
  lastName: string;
  location: string;
  role: string;
  avatar: string;
  avatarPublicId: string;
}

interface IUserMethods {
  createSendToken: (res: Response) => Promise<void>;
  checkUserIsValid: (req: Request) => Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: 'lastName',
  },
  location: {
    type: String,
    default: 'my city',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  avatar: String,
  avatarPublicId: String,
});

// Document Middleware
userSchema.pre('save', async function (): Promise<void> {
  this.password = await hashPassword(this.password);
});

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.methods.checkUserIsValid = async function (req: Request) {
  return !!(
    this &&
    this.name &&
    (await comparePassword(req.body.password, this.password))
  );
};

userSchema.methods.createSendToken = async function (res: Response) {
  const token = await createJWT({ id: this.id, role: this.role });
  const oneDay = 1000 * 60 * 60 * 24;

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: true,
    sameSite: 'none',
  });
};

export default model<IUser, UserModel>('User', userSchema);
