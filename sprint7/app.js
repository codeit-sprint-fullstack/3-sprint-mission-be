import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import express from "express";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

//게시글 목록 조회 api
app.get("/article", async (req, res) => {
  const { limit = 10, offset = 0, order = "new" } = req.query;
  const articles = await prisma.article.findMany({
    take: Number(limit),
    skip: Number(offset),
    orderBy: {
      createdAt: order === "new" ? "desc" : "asc",
    },
  });
  res.send(articles);
});

//게시글 등록 api
app.post("/article", async (req, res) => {
  const newArticle = await prisma.article.create({
    data: req.body,
  });
  res.status(201).send(newArticle);
});

//게시글 수정 api
app.patch("/article/:id", async (req, res) => {
  const id = Number(req.params.id);
  const updatedArticle = await prisma.article.update({
    data: req.body,
    where: {
      id: id,
    },
  });
  res.send(updatedArticle);
});

//게시글 삭제 api
app.delete("/article/:id", async (req, res) => {
  const id = Number(req.params.id);
  const article = await prisma.article.findUnique({
    where: {
      id: id,
    },
  });
  if (!article) {
    return res.status(404).send({ message: "게시물 없음" });
  }
  await prisma.article.delete({
    where: {
      id: id,
    },
  });
  res.status(204).send(article);
});
/////////////////////댓글///////////////////////////

// 댓글 달기 api
app.post("/article/comment", async (req, res) => {
  const newComment = await prisma.articleComment.create({
    data: req.body,
  });
  res.status(201).send(newComment);
});
//댓글 조회 api
app.get("/article/comment", async (req, res) => {});

//댓글 수정 api
app.patch("/article/comment/:id", async (req, res) => {
  const id = Number(req.params.id);
  const updatedComment = await prisma.articleComment.update({
    data: req.body,
    where: {
      id: id,
    },
  });
  res.send(updatedComment);
});

//댓글 삭제 api
app.delete("/article/comment/:id", async (req, res) => {
  const id = Number(req.params.id);
  const comment = await prisma.articleComment.findUnique({
    where: {
      id: id,
    },
  });
  if (!comment) {
    return res.status(404).send({ message: "댓글 없음" });
  }
  await prisma.articleComment.delete({
    where: {
      id: id,
    },
  });
  res.status(204).send(comment);
});
