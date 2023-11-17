import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { v2 as cloudinary } from 'cloudinary';
// Routers
import authRouter from './routes/authRouter.js';
import jobRouter from './routes/jobRouter.js';
import userRouter from './routes/userRouter.js';
// Middlewares
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import { authenticateUser } from './middlewares/authMiddleware.js';
// Access Environment Variables
dotenv.config();
// Create HTTP Server
const app = express();
// Cors
const corsOptions: CorsOptions = {
  origin: 'https://jobify-e5da.onrender.com',
  credentials: true,
};
app.use(cors(corsOptions));
// Security Packages
app.use(helmet());
app.use(mongoSanitize());
// Setting Up Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// Morgan Middleware for Development
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
// Body Parser
app.use(express.json());
// Cookies Parser
app.use(cookieParser());
// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
// Not Found Route
app.use('*', (req, res, next) => {
  res.status(404).json({ message: 'Route not found.' });
});
// Global Error Handler
app.use(errorHandlerMiddleware);
// Connect to Database and Start Listening
const port = process.env.PORT || 5000;
if (!process.env.MONGO_URL) {
  console.log('MongoDB URL is not valid.');
  process.exit(1);
}
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server running on PORT ${port}...`);
  });
} catch (err) {
  console.log(err);
  process.exit(1);
}