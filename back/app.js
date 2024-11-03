import express from "express";
import { MockData } from "./data/mock.js";
import Task from "./models/Task.js";
import mongoose from "mongoose";
import cors from "cors";
import Product from "./models/Product.js";
import * as dotenv from "dotenv";

dotenv.config();

// npm install dotenv

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    "Access-Control-Allow-Origin": "*",
  })
);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

async function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (err) {
      console.log("err", err);
      res.status(500).send({
        message: err.message,
        error: "500",
      });
    }
  };
}

// 상품 등록 API
app.post(
  "/db/tasks",
  asyncHandler(async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) res.status(400).send({ message: "필수갑 누락" });
    const newProduct = await Product.create(req.body);
    res.status(201).send(newProduct);
  })
);
/*
POST API만들어서,
URL /db/good/susu
BODY good, hope, love
몽고디비 스키마 Product에 good은 name으로 , description은 hope로 , age는 love로 넣어주세요.
다 넣었으면 방금 넣었던 값을 클라이언트에게 반환해주세요.
*/

// app.post("/db/good/susu", async(req, res) => {
//   const { good, hope, love } = req.body;
//   const aa  = await Product.create({
//     name : good,
//     description : hope,
//     age : love,
//   })
//   res.send(aa)
// })

// 상품 상세 조회 API
app.get(
  "/db/tasks",
  asyncHandler(async (req, res) => {
    const datas = await Product.find();
    res.status(201).send(datas);
  })
);

// 상품 수정 API
app.patch(
  "/db/tasks/:_id",
  asyncHandler(async (req, res) => {
    const id = req.params._id;
    const task = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(201).send(task);
  })
);

// 상품 삭제 API
app.delete(
  "/db/tasks/:_id",
  asyncHandler(async (req, res) => {
    const id = req.params._id;
    await Product.findByIdAndDelete(id);
    res.status(204).send({
      message: "success",
    });
  })
);

// 상품 목록 조회 API
app.get(
  "/db/tasks/query",
  asyncHandler(async (req, res) => {
    const { limit = 10, offset = 0, keyword = "" } = req.query;
    const mongoQuery = keyword
      ? {
          $or: [
            { description: { $regex: keyword, $options: "i" } },
            { name: { $regex: keyword, $options: "i" } },
          ],
        }
      : {};
    const tasks = await Product.find(mongoQuery).skip(offset).limit(limit);
    res.status(201).send(tasks);
  })
);

app.listen(8000, () => console.log("localhost:8000 서버 시작"));
