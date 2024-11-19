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
  const offsetNum = parseInt(offset);
  const limitNum = parseInt(limit);

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
    skip: offsetNum, // skip으로 offset설정
    take: limitNum,  // take으로 limit설정
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
  try {
    assert(req.body, CreateProduct);
    const newProduct = await prisma.product.create({
      data: req.body,
    })
    console.log(produnewProductcts);
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
  const { keyword, offset = 0, limit = 10, order = 'recent' } = req.query;

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
  if (keyword) {
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { content: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
    })
    res.send(articles);
    return;
  }
  const articles = await prisma.article.findMany({
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
  })
  const totalArticles = await prisma.article.count();
  const totalPages = Math.ceil(totalArticles / parseInt(limit));

  res.send({ totalArticles, articles, totalPages });
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

  let orderBy;
  switch (order) {
    case 'recent':
      orderBy = { createdAt: 'desc' };
      break;
    case 'best':
      orderBy = { likes: 'desc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }
  const comments = await prisma.comment.findMany({
    where: {
      articleId,
    },
    orderBy,
    take: parseInt(limit),
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

  let orderBy;
  switch (order) {
    case 'recent':
      orderBy = { createdAt: 'desc' };
      break;
    case 'best':
      orderBy = { likes: 'desc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    default:
      orderBy = { createdAt: 'desc' };
  }
  const totalArticleComments = await prisma.comment.count();
  const comments = await prisma.comment.findMany({
    orderBy,
    take: parseInt(limit),
    skip: cursor ? 1 : parseInt(limit),
    cursor: cursor ? { id: cursor } : undefined,
  })

  const lastComment = comments[comments.length - 1];
  const nextCursor = lastComment ? lastComment.id : null;
  const totalPage = Math.ceil(totalArticleComments / parseInt(limit));

  res.send({
    totalArticleComments,
    comments,
    nextCursor,
    totalPage
  });
}))

app.listen(process.env.PORT || 8000, () => console.log('Server Started'));