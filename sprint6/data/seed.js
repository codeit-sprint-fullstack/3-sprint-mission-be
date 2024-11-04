import mongoose from "mongoose";
import { MockData } from "./mock.js";
import { DATABASE_URL } from "../env.js";
import Task from "../models/Task.js";
import * as dotenv from 'dotenv';

// .env 파일을 읽어와 환경변수로 설정
dotenv.config();

// 환경변수가 설정된 이후에 데이터베이스에 연결
mongoose.connect(process.env.DATABASE_URL);

// 데이터 삭제 및 삽입
await Task.deleteMany({});
await Task.insertMany(MockData);

console.log("success");
// 데이터베이스 연결 종료
mongoose.connection.close();
