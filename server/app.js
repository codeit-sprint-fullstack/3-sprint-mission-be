import express from "express";
import { DATABASE_URL } from "./env.js";
import mongoose from "mongoose";
import Product from "./models/Product.js";
// mongoDB 연결
mongoose.connect(DATABASE_URL).then(() => console.log("Connected to DB"));

const app = express();
//테스트
app.get("/test", (req, res) => {
  res.send("test1!~!!!");
});
//아이디에 맞는 상품 가져오기
app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  res.send(product);
});
//상품 전체 가져오기 대신 count가 있으면 그 개수만, 정렬도
app.get("/products", async (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count);

  const sortOption = {
    // sort가 있으면 그거 쓰고 없으면 desc(내림차순)
    createdAt: sort || "desc",
  };

  const allData = await Product.find().sort(sortOption).limit(count);
  res.send(allData);
});
//상품 등록하기
app.post("/product/register", async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).send(newProduct);
});
//상품 수정하기
app.patch("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (product) {
    //
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });
    await product.save();
    res.send(product);
  } else {
    res.status(404).send({ message: "cannot find id" });
  }
});
// 상품 삭제하기
app.delete("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id);
  if (task) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: "cannot find id" });
  }
});

app.listen(8000, () => console.log("서버 시작~!!"));
