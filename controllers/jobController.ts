import { Handler } from "express";
import Job from "../models/JobModel";

export const getAllJobs = () => {};
export const createJob: Handler = async (req, res, next) => {
  const job = await Job.create(req.body);
  res.status(201).json({ job });
};
export const getJob = () => {};
export const updateJob = () => {};
export const deleteJob = () => {};
