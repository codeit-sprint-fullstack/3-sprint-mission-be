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
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: String,
      maxLength: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
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
