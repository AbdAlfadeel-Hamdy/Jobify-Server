import * as dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";

// Routers
import jobRouter from "./routes/jobRouter";

dotenv.config();

const app = express();

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json());

app.use("/api/v1/jobs", jobRouter);

const port = process.env.PORT || 5100;

try {
  if (!process.env.MONGO_URL) throw new Error("MongoDB URL is not valid.");
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server running on PORT ${port}...`);
  });
} catch (err) {
  console.log(err);
  process.exit(1);
}
