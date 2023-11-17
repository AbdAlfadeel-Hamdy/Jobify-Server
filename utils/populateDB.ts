import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Job from '../models/Job.js';
import User from '../models/User.js';
// Read .env Files
dotenv.config();

try {
  if (!process.env.MONGO_URL) throw new Error('MongoDB URL is not valid.');
  await mongoose.connect(process.env.MONGO_URL);
  const user = await User.findOne({ email: 'testuser@test.com' });
  const dataFile = await readFile('./utils/mockData.json');
  const jsonData = JSON.parse(dataFile.toString()) as (typeof Job)[];
  const jobs = jsonData.map((job) => ({ ...job, createdBy: user?._id }));
  await Job.deleteMany({ createdBy: user?._id });
  await Job.create(jobs);
  console.log('Data loaded successfully!!!');
  process.exit(0);
} catch (error) {
  console.log(error);
  process.exit(1);
}
