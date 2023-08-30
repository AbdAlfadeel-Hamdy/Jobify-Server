import "express-async-errors";
import * as dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import mongoose from "mongoose";

// Routers
import jobRouter from "./routes/jobRouter";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/jobs", jobRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({ message: "Not found." });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: "Something went wrong." });
});

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
