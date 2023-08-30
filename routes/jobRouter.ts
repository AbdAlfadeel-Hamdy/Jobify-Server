import { Router } from "express";
import {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController";

const router = Router();

router.route("/").get(getAllJobs).post(createJob);
router.route("/:id").get(getJob).patch(updateJob).delete(deleteJob);

export default router;
