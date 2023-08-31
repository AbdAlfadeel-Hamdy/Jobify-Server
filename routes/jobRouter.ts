import { Router } from "express";
import {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController";
import {
  validateIdParam,
  validateJobInput,
} from "../middlewares/validationMiddleware";

const router = Router();

router
  .route("/")
  .get(getAllJobs)
  .post(validateJobInput as any, createJob);
router
  .route("/:id")
  .all(validateIdParam as any)
  .get(getJob)
  .patch(validateJobInput as any, updateJob)
  .delete(deleteJob);

export default router;
