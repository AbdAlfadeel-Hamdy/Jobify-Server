"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const router = (0, express_1.Router)();
router.route("/").get(jobController_1.getAllJobs).post(jobController_1.createJob);
router.route("/:id").get().patch().delete();
exports.default = router;
