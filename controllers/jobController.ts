import { Handler } from "express";
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import day from "dayjs";
import Job from "../models/JobModel";

export const getAllJobs: Handler = async (req: any, res, next) => {
  const { search, jobStatus, jobType, sort } = req.query;
  const filterObj: { [key: string]: any } = {
    createdBy: req.user.id,
  };
  if (search)
    filterObj.$or = [
      { position: new RegExp(search, "i") },
      { company: { $regex: search, $options: "i" } },
    ];
  if (jobStatus && jobStatus !== "all") filterObj.jobStatus = jobStatus;
  if (jobType && jobType !== "all") filterObj.jobType = jobType;
  const sortOptions = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };
  const sortKey =
    sortOptions[sort as keyof typeof sortOptions] || sortOptions.newest;
  const jobs = await Job.find(filterObj).sort(sortKey);
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

interface JobStatusStats {
  pending?: number;
  interview?: number;
  declined?: number;
}

export const showStats: Handler = async (req: any, res, next) => {
  const stats = (await Job.aggregate([
    {
      $match: {
        createdBy: new Types.ObjectId(req.user.id),
      },
    },
    {
      $group: {
        _id: "$jobStatus",
        count: { $sum: 1 },
      },
    },
  ])) as { _id: "pending" | "interview" | "declined"; count: number }[];

  const statsObj = stats.reduce((acc: JobStatusStats, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {}) as JobStatusStats;

  const defaultStats = {
    pending: statsObj.pending || 0,
    interview: statsObj.interview || 0,
    declined: statsObj.declined || 0,
  };

  const monthlyApplications = (await Job.aggregate([
    {
      $match: {
        createdBy: new Types.ObjectId(req.user.id),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": -1,
        "_id.month": -1,
      },
    },
    {
      $limit: 6,
    },
  ])) as { _id: { year: number; month: number }; count: number }[];

  const monthlyApplicationsFormatted = monthlyApplications
    .map(({ _id: { year, month }, count }) => ({
      count,
      date: day()
        .year(year)
        .month(month - 1)
        .format("MMM YY"),
    }))
    .reverse();

  res
    .status(StatusCodes.OK)
    .json({ defaultStats, monthlyApplicationsFormatted });
};
