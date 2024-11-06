import express from "express";
import mongoose from "mongoose";
import { DATABASE_URL } from "./.env";
import Product from "./sprint6/models/Product.js";
import * as dotenv from 'dotenv';
import cors from 'cors';

mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB'));
dotenv.config();

const app = express();

app.use(
  cors()
);
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  }
}

app.get('/products', asyncHandler(async (req, res) => {

  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;

  const sortOption = {
    createdAt: sort === 'recent' ? 'desc' : 'asc'
  };
  const products = await Product.find().sort(sortOption).limit(count);
  res.send(products);
}));

app.get('/products/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const products = await Product.findById(id);
  if (products) {
    res.send(products);
  } else {
    res.status(404).send({ message: '상품을 찾을 수 없습니다.' })
  }
}));

app.post('/products', asyncHandler(async (req, res) => {
  const newProduct = await Product.create(req.body)
  res.status(201).send(newProduct);
}));

app.patch('/products/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const products = await Product.findById(id);
  if (products) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    })
    await products.save();
    res.send(products);
  } else {
    res.status(404).send({ message: '올바른 형식을 사용해주세요.' })
  }
}))

app.delete('/products/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndDelete(id);
  if (product) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'id를 확인해주세요.' })
  }
}))

app.listen(process.env.PORT || 8000, () => console.log('Server Started'));