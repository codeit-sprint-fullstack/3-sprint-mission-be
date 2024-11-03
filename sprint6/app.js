import express from "express";
import mongoose from "mongoose";
import { MockData } from "./data/mock.js";
import { DATABASE_URL } from "./env.js";
import router from "./routes/index.js";
import Task from "./models/Task.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    "Access-Control-Allow-Origin": "*",
  })
);

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (err) {
      console.log("err", err);
    }
  };
}

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/", router);

app.get("/good", (req, res) => {
  res.send({ message: "goo22d" });
});

app.get("/hello", (req, res) => {
  const keywordQuery = req.query.keyword;
  res.send("안녕하세요 3기 님들^^");
});

app.get("/tasks", (req, res) => {
  res.send(MockData);
});

app.get("/tasks/abc", (req, res) => {
  const result = [];
  for (let i = 0; i < MockData.length; i++) {
    if (MockData[i].isComplete) result.push(MockData[i]);
  }
  res.send(result);
});

// :id에 동적 url을 받아올 수 있다^^
app.get("/task/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = MockData.find((task) => task.id === id);
  res.send(task);
});

app.get("/db/tasks", async (req, res) => {
  const sort = req.query.sort; // asc, desc
  const count = Number(req.query.count);

  const sortOption = {
    createdAt: sort || "asc",
  };
  const allData = await Task.find().sort(sortOption).limit(count);
  res.send(allData);
});

app.get("/db/task/:id", async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  res.send(task);
});

app.post("/tasks", (req, res) => {
  const requestBody = req.body;
  const ids = MockData.map((data) => data.id);
  requestBody.id = Math.max(...ids) + 1;
  requestBody.isComplete = false;
  requestBody.createdAt = new Date();
  requestBody.updatedAt = new Date();
  console.log("requestBody", requestBody);
  MockData.push(requestBody);
  res.status(201).send(requestBody);
});

app.post("/db/tasks", async (req, res) => {
  try {
    // 1. 예외처리, title길이라던지, 필수값이라던지..
    // 2. 코드 오류 처리하기
    const newTask = await Task.create(req.body);
    res.status(201).send(newTask);
  } catch (err) {
    console.log("err", err);
    res.status(400).send({ message: "응에러" });
  }
});

app.patch("/db/task/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findById(id);
    // 기존거 있는지 확인

    if (task) {
      // 객체 변경
      task.title = req.body.title;
      task.description = req.body.description;
    }

    // 변경한 객체 db 저장
    await task.save();
    res.send(task);
  } catch (err) {
    console.log("err", err);
    res.send("실패^^");
  }
});

app.listen(8000, () => console.log("서버 시작"));
