import "express-async-errors";
import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import { v2 as cloudinary } from "cloudinary";
// Routers
import authRouter from "./routes/authRouter";
import jobRouter from "./routes/jobRouter";
import userRouter from "./routes/userRouter";
// Middlewares
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import { authenticateUser } from "./middlewares/authMiddleware";
// Reading Environment Variables
dotenv.config();
// Running Express
const app = express();
// Cors
const corsOptions: CorsOptions = {
  origin: "https://jobify-e5da.onrender.com",
  credentials: true,
};
app.use(cors(corsOptions));
// Setting Up Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// Morgan Middleware for Development
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// Body Parser
app.use(express.json());
// Cookies Parser
app.use(cookieParser());
// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
// Not Found Route
app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Route not found." });
});
// Global Error Handling Middleware
app.use(errorHandlerMiddleware);
// Connecting to Database and Running Server
const port = 5100;
if (!process.env.MONGO_URL) {
  console.log("MongoDB URL is not valid.");
  process.exit(1);
}
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on PORT ${port}...`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
