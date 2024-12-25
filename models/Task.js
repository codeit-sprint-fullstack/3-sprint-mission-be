import mongoose from "mongoose";

console.log(process.env.GOOD);
// 수정님컴터 : asdasdasdasd
// 태진님컴터 : bbbb

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
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
