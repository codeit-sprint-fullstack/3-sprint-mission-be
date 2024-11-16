import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { PrismaClient } from "@prisma/client";

// import Product from "./models/Product.js";
// import cors from 'cors';

const prisma = new PrismaClient();

const app = express();
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
  const { offset = 0, limit = 10, order = 'newest' } = req.query;

  let orderBy;
  switch (order) {
    case 'newst':
      orderBy = { createdAt: 'desc' };
      break;
    case 'best':
      orderBy = { likes: 'desc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }

  const products = await prisma.product.findMany({
    orderBy,
    // parseInt 정수로 반환
    skip: parseInt(offset), // skip으로 offset설정
    take: parseInt(limit),  // take으로 limit설정
  });
  res.send(products);
}));

app.get('/products/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const products = await prisma.product.findUnique({
    where: { id },
  });
  if (products) {
    res.send(products);
  } else {
    res.status(404).send({ message: '상품을 찾을 수 없습니다.' })
  }
}));

// app.post('/products', asyncHandler(async (req, res) => {
//   const newProduct = await Product.create(req.body)
//   res.status(201).send(newProduct);
// }));

// app.patch('/products/:id', asyncHandler(async (req, res) => {
//   const id = req.params.id;
//   console.log(req.body);
//   const products = await Product.findByIdAndUpdate(id, req.body, { new: true });
//   console.log(products);
//   res.send(products);
// }))

// app.delete('/products/:id', asyncHandler(async (req, res) => {
//   const id = req.params.id;
//   const product = await Product.findByIdAndDelete(id);
//   if (product) {
//     res.sendStatus(204);
//   } else {
//     res.status(404).send({ message: 'id를 확인해주세요.' })
//   }
// }))

app.listen(process.env.PORT || 8000, () => console.log('Server Started'));