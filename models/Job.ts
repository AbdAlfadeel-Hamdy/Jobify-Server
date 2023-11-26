import { Schema, model, Types } from 'mongoose';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';

interface IJob {
  company: string;
  position: string;
  jobStatus: string;
  jobType: string;
  jobLocation: string;
  createdBy: {
    type: Types.ObjectId;
    ref: string;
  };
}

const jobSchema = new Schema<IJob>(
  {
    company: String,
    position: String,
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      default: 'my city',
    },
    createdBy: {
      type: Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default model('Job', jobSchema);
