"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const constants_1 = require("../utils/constants");
const jobSchema = new mongoose_1.Schema({
    company: String,
    position: String,
    jobStatus: {
        type: String,
        enum: Object.values(constants_1.JOB_STATUS),
        default: constants_1.JOB_STATUS.PENDING,
    },
    jobType: {
        type: String,
        enum: Object.values(constants_1.JOB_TYPE),
        default: constants_1.JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
        type: String,
        default: "my city",
    },
    createdBy: {
        type: mongoose_1.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Job", jobSchema);
