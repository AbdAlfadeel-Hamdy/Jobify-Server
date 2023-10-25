import { Router } from "express";
import { ValidationChain } from "express-validator";
import {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
  showStats,
} from "../controllers/jobController";
import {
  validateIdParam,
  validateJobInput,
} from "../middlewares/validationMiddleware";
import { checkForTestUser } from "../middlewares/authMiddleware";

const router = Router();

router
  .route("/")
  .get(getAllJobs)
  .post(checkForTestUser, validateJobInput as ValidationChain[], createJob);
router.route("/stats").get(showStats);
router
  .route("/:id")
  .all(validateIdParam as ValidationChain[])
  .get(getJob)
  .patch(checkForTestUser, validateJobInput as ValidationChain[], updateJob)
  .delete(checkForTestUser, deleteJob);

export default router;
