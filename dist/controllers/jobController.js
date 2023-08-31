"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.getJob = exports.createJob = exports.getAllJobs = void 0;
const http_status_codes_1 = require("http-status-codes");
const JobModel_1 = __importDefault(require("../models/JobModel"));
const getAllJobs = async (req, res, next) => {
    const jobs = await JobModel_1.default.find();
    res.status(http_status_codes_1.StatusCodes.OK).json({ jobs });
};
exports.getAllJobs = getAllJobs;
const createJob = async (req, res, next) => {
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
    const removedJob = await JobModel_1.default.findByIdAndDelete(req.params.id);
    res.status(http_status_codes_1.StatusCodes.OK).json({ message: "Job deleted.", job: removedJob });
};
exports.deleteJob = deleteJob;
