import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import Job from "../models/JobModel";

export const getAllJobs: Handler = async (req, res, next) => {
  const jobs = await Job.find();

  res.status(StatusCodes.OK).json({ jobs });
};
export const createJob: Handler = async (req, res, next) => {
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};
export const getJob: Handler = async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) console.log("No job with this ID.");
  res.status(StatusCodes.OK).json({ job });
};
export const updateJob: Handler = async (req, res, next) => {
  const { id } = req.params;
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!updatedJob) console.log("No job with this ID.");

  res
    .status(StatusCodes.OK)
    .json({ message: "Job modified.", job: updatedJob });
};
export const deleteJob: Handler = async (req, res, next) => {
  const { id } = req.params;
  const removedJob = await Job.findByIdAndDelete(id);

  if (!removedJob) console.log("No job with this ID.");

  res.status(StatusCodes.OK).json({ message: "Job deleted.", job: removedJob });
};
