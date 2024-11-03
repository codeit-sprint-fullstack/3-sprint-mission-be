import mongoose from "mongoose";
import { MockData } from "./mock.js";
import Task from "../models/Task.js";
import * as dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(MockData);

console.log("success");
mongoose.connection.close();
