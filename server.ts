import "express-async-errors";
import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import { v2 as cloudinary } from "cloudinary";
// Public
import path, { dirname } from "path";
import { fileURLToPath } from "url";
// Routers
import authRouter from "./routes/authRouter";
import jobRouter from "./routes/jobRouter";
import userRouter from "./routes/userRouter";
// Middlewares
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import { authenticateUser } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});
// const __dirname = dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.static(path.resolve("./public")));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === "production") {
  const corsOptions: CorsOptions = {
    origin: "https://jobify-e5da.onrender.com",
    methods: "GET, POST, PATCH, DELETE",
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "Set-Cookie"],
    optionsSuccessStatus: 204,
  };
  app.use(cors(corsOptions));
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Route not found." });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;

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
