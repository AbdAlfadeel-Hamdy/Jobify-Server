import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import Job from "../models/JobModel";

export const getAllJobs: Handler = async (req: any, res, next) => {
  const jobs = await Job.find({ createdBy: req.user.id });
  res.status(StatusCodes.OK).json({ jobs });
};

export const createJob: Handler = async (req: any, res, next) => {
  req.body.createdBy = req.user.id;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const getJob: Handler = async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  res.status(StatusCodes.OK).json({ job });
};

export const updateJob: Handler = async (req, res, next) => {
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: "Job modified.", job: updatedJob });
};

export const deleteJob: Handler = async (req, res, next) => {
  const deletedJob = await Job.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ message: "Job deleted.", job: deletedJob });
};
