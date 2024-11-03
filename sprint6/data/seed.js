import mongoose from "mongoose";
import { MockData } from "./mock.js";
import { DATABASE_URL } from "../env.js";
import Task from "../models/Task.js";

mongoose.connect(DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(MockData);

console.log("success");
mongoose.connection.close();
