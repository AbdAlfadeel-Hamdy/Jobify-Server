"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router
    .route("/")
    .get(jobController_1.getAllJobs)
    .post(authMiddleware_1.checkForTestUser, validationMiddleware_1.validateJobInput, jobController_1.createJob);
router
    .route("/:id")
    .all(validationMiddleware_1.validateIdParam)
    .get(jobController_1.getJob)
    .patch(authMiddleware_1.checkForTestUser, validationMiddleware_1.validateJobInput, jobController_1.updateJob)
    .delete(authMiddleware_1.checkForTestUser, jobController_1.deleteJob);
exports.default = router;
