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
router.route("/:id").get().patch().delete();

export default router;
