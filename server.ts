import "express-async-errors";
import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

// Routers
import jobRouter from "./routes/jobRouter";
import authRouter from "./routes/authRouter";
// Middlewares
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import { authenticateUser } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/auth", authRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Not found." });
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
