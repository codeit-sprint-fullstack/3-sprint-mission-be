import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { assert } from "superstruct";
import {
  CreateProduct,
  PatchProduct,
  CreateArticle,
  PatchArticle
} from "./structs.js";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// 에러 처리 함수
function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e.name === 'StructureError' ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  }
}

/** Products Routes **/

// 상품 목록 조회
app.get('/products', asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, order = 'recent' } = req.query;

  let orderBy;
  switch (order) {
    case 'recent':
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

// 상품 조회
app.get('/products/:productId', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const products = await prisma.product.findUniqueOrThrow({
    where: { id: productId },
  });
  if (products) {
    res.send(products);
  } else {
    res.status(404).send({ message: '상품을 찾을 수 없습니다.' })
  }
}));

// 상품 생성
app.post('/products', asyncHandler(async (req, res) => {
  assert(req.body, CreateProduct);
  const newProduct = await prisma.product.create({
    data: req.body,
  })
  console.log(produnewProductcts);
  res.status(201).send(newProduct);
}));

// 상품 수정
app.patch('/products/:productId', asyncHandler(async (req, res) => {
  const { productId } = req.params;
  assert(req.body, PatchProduct);
  const products = await prisma.product.update({
    where: { id: productId },
    data: req.body,
  });
  console.log(products);
  res.send(products);
}))

// 상품 삭제
app.delete('/products/:productId', asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await prisma.product.delete({
    where: { id: productId },
  });
  if (product) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'id를 확인해주세요.' })
  }
}))

/** Articles Routes **/

// 게시글 생성
app.post('/articles', asyncHandler(async (req, res) => {
  assert(req.body, CreateArticle);
  const { title, content } = req.body;
  const nweArticle = await prisma.article.create({
    data: {
      title,
      content,
    }
  })
  console.log(nweArticle);
  res.status(201).send(nweArticle);
}))

// 게시글 조회
app.get('/articles/:articleId', asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const articles = await prisma.article.findUniqueOrThrow({
    where: { id: articleId },
  });
  if (articles) {
    res.send(articles);
  } else {
    res.status(404).send({ message: '상품을 찾을 수 없습니다.' })
  }
}))

// 게시글 수정
app.patch('/articles/:articleId', asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  assert(req.body, PatchArticle);
  const articles = await prisma.article.update({
    where: { id: articleId },
    data: req.body,
  });
  console.log(articles);
  res.send(articles);
}))

// 게시글 목록 조회
app.get('/articles', asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, order = 'recent' } = req.query;

  let orderBy;
  switch (order) {
    case 'recent':
      orderBy = { createdAt: 'desc' };
      break;
    case 'best':
      orderBy = { likes: 'desc' };
      break;
    case 'oldeest':
      orderBy = { createdAt: 'asc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }
  const articles = await prisma.article.findMany({
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
  })
  res.send(articles);
}))

// 게시글 삭제
app.delete('/articles/:articleId', asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const article = await prisma.article.delete({
    where: { id: articleId },
  });
  if (article) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'id를 확인해주세요.' })
  }
}))

app.listen(process.env.PORT || 8000, () => console.log('Server Started'));