import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { assert } from "superstruct";
import {
  CreateProduct,
  PatchProduct,
  CreateArticle,
  PatchArticle,
  CreateComment,
  PatchComment
} from "./structs.js";
import asyncHandler from "./asyncHandlerFunction.js";
import orderByFunction from "./orderByFunction.js";
import {
  productsPaginationHandler,
  articlesPaginationHandler
} from "./paginationHandler.js";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

/** Products Routes **/

// 상품 목록 조회
app.get('/products', asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, order = 'recent' } = req.query;
  const offsetNum = parseInt(offset);
  const limitNum = parseInt(limit);

  const orderBy = orderByFunction(order);

  const products = await prisma.product.findMany({
    orderBy,
    skip: offsetNum, // skip으로 offset설정
    take: limitNum,  // take으로 limit설정
  });
  console.log("products, 여기긴", products);
  const responseData = await productsPaginationHandler(products, offsetNum, limitNum);
  res.send(responseData);
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
  try {
    assert(req.body, CreateProduct);
    const newProduct = await prisma.product.create({
      data: req.body,
    })
    console.log(newProduct);
    res.status(201).send(newProduct);
  } catch (error) {
    res.status(400).send('Bad Request: ' + error.message);
  }
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
  const productId = req.params.productId;
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
  try {
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
  } catch (error) {
    res.status(400).send('Bad Request: ' + error.message);
  }
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
  const { keyword, offset = 0, limit = 10, order = 'recent' } = req.query;
  const offsetNum = parseInt(offset);
  const limitNum = parseInt(limit);

  const orderBy = orderByFunction(order);

  if (keyword) {
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      orderBy,
      skip: offsetNum,
      take: limitNum,
    })
    res.send(articles);
    return;
  }
  
  const articles = await prisma.article.findMany({
    orderBy,
    skip: offsetNum,
    take: limitNum,
  })

  const responseData = await articlesPaginationHandler(articles, offsetNum, limitNum);
  res.send(responseData);
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

// 게시글 댓글 목록 조회
app.get('/articles/:articleId/comments', asyncHandler(async (req, res) => {
  const { articleId } = req.params;
  const { cursor, limit = 10, order = 'recent' } = req.query;

  const limitNum = parseInt(limit);

  const orderBy = orderByFunction(order);
  const comments = await prisma.comment.findMany({
    where: {
      articleId,
    },
    orderBy,
    take: limitNum,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
  });

  const lastComment = comments[comments.length - 1];
  const nextCursor = lastComment ? lastComment.id : null;

  res.send({ comments, nextCursor });
  // send() 메서드를 사용할 때 인자의 값이 복수일 때는 객체로 전달해야 한다.
}))

/** Comments Routes **/

// 게시글 댓글 등록
app.post('/articles/:articleId/comments', asyncHandler(async (req, res) => {
  try {
    assert(req.body, CreateComment);
    const { articleId } = req.params;
    const { content } = req.body;
    const newComment = await prisma.comment.create({
      data: {
        content,
        article: {
          connect: { id: articleId },
        },
      }
    })
    console.log(newComment);
    res.status(201).send(newComment);
  } catch (error) {
    res.status(400).send('Bad Request: ' + error.message);
  }
}))

// 게시글 댓글 수정
app.patch('/comments/:commentId', asyncHandler(async (req, res) => {
  assert(req.body, PatchComment);
  const { commentId } = req.params;
  const { content } = req.body;
  const comments = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });
  console.log(comments);
  res.send(comments);
}))

// 게시글 댓글 삭제
app.delete('/comments/:commentId', asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const comment = await prisma.comment.delete({
    where: { id: commentId },
  });
  if (comment) {
    res.sendStatus(204);
  } else {
    res.status(404).send({ message: 'id를 확인해주세요.' })
  }
}))

// 모드 게시글 댓글 목록 조회
app.get('/comments', asyncHandler(async (req, res) => {
  const { cursor, limit = 10, order = 'recent' } = req.query;

  const limitNum = parseInt(limit);

  const orderBy = orderByFunction(order);
  const totalArticleComments = await prisma.comment.count();
  const comments = await prisma.comment.findMany({
    orderBy,
    take: limitNum,
    skip: cursor ? 1 : limitNum,
    cursor: cursor ? { id: cursor } : undefined,
  })

  const lastComment = comments[comments.length - 1];
  const nextCursor = lastComment ? lastComment.id : null;
  const totalPage = Math.ceil(totalArticleComments / limitNum);

  res.send({
    totalArticleComments,
    comments,
    nextCursor,
    totalPage
  });
}))

app.listen(process.env.PORT || 8000, () => console.log('Server Started'));