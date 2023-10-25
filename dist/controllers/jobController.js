"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showStats = exports.deleteJob = exports.updateJob = exports.getJob = exports.createJob = exports.getAllJobs = void 0;
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = require("mongoose");
const dayjs_1 = __importDefault(require("dayjs"));
const JobModel_1 = __importDefault(require("../models/JobModel"));
const getAllJobs = async (req, res, next) => {
    const jobs = await JobModel_1.default.find({ createdBy: req.user.id });
    res.status(http_status_codes_1.StatusCodes.OK).json({ jobs });
};
exports.getAllJobs = getAllJobs;
const createJob = async (req, res, next) => {
    req.body.createdBy = req.user.id;
    const job = await JobModel_1.default.create(req.body);
    res.status(http_status_codes_1.StatusCodes.CREATED).json({ job });
};
exports.createJob = createJob;
const getJob = async (req, res, next) => {
    const job = await JobModel_1.default.findById(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ job });
};
exports.getJob = getJob;
const updateJob = async (req, res, next) => {
    const updatedJob = await JobModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ message: "Job modified.", job: updatedJob });
};
exports.updateJob = updateJob;
const deleteJob = async (req, res, next) => {
    const deletedJob = await JobModel_1.default.findByIdAndDelete(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Job deleted.", job: deletedJob });
};
exports.deleteJob = deleteJob;
const showStats = async (req, res, next) => {
    const stats = (await JobModel_1.default.aggregate([
        {
            $match: {
                createdBy: new mongoose_1.Types.ObjectId(req.user.id),
            },
        },
        {
            $group: {
                _id: "$jobStatus",
                count: { $sum: 1 },
            },
        },
    ]));
    const statsObj = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count;
        return acc;
    }, {});
    const defaultStats = {
        pending: statsObj.pending || 0,
        interview: statsObj.interview || 0,
        declined: statsObj.declined || 0,
    };
    const monthlyApplications = (await JobModel_1.default.aggregate([
        {
            $match: {
                createdBy: new mongoose_1.Types.ObjectId(req.user.id),
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
    ]));
    const monthlyApplicationsFormatted = monthlyApplications
        .map(({ _id: { year, month }, count }) => ({
        count,
        date: (0, dayjs_1.default)()
            .year(year)
            .month(month - 1)
            .format("MMM YY"),
    }))
        .reverse();
    res
        .status(http_status_codes_1.StatusCodes.OK)
        .json({ defaultStats, monthlyApplicationsFormatted });
};
exports.showStats = showStats;
