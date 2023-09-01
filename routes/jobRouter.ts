import { Router } from "express";
import { ValidationChain } from "express-validator";
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
  .post(validateJobInput as ValidationChain[], createJob);
router
  .route("/:id")
  .all(validateIdParam as ValidationChain[])
  .get(getJob)
  .patch(validateJobInput as ValidationChain[], updateJob)
  .delete(deleteJob);

export default router;
