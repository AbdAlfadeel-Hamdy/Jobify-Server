"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    company: String,
    position: String,
    jobStatus: {
        type: String,
        enum: ["interview", "declined", "pending"],
        default: "pending",
    },
    jobType: {
        type: String,
        enum: ["full-time", "part-time", "internship"],
        default: "full-time",
    },
    jobLocation: {
        type: String,
        default: "my city",
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("Job", jobSchema);
