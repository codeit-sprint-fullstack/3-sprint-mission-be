import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      maxLength: 30,
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;
