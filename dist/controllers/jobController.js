"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.getJob = exports.createJob = exports.getAllJobs = void 0;
const JobModel_1 = __importDefault(require("../models/JobModel"));
const getAllJobs = () => { };
exports.getAllJobs = getAllJobs;
const createJob = async (req, res, next) => {
    const job = await JobModel_1.default.create(req.body);
    res.status(201).json({ job });
};
exports.createJob = createJob;
const getJob = () => { };
exports.getJob = getJob;
const updateJob = () => { };
exports.updateJob = updateJob;
const deleteJob = () => { };
exports.deleteJob = deleteJob;
