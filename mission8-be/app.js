import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  })
);

//게시글 목록 조회 api
app.get("/articles", async (req, res) => {
  try {
    const { limit = 5, offset = 0, order = "최신순" } = req.query;
    const articles = await prisma.article.findMany({
      take: Number(limit),
      skip: Number(offset),
      orderBy: {
        createdAt: order === "최신순" ? "desc" : "asc",
      },
    });
    res.send(articles);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Server Error" });
  }
});

//게시글 하나 조회
app.get("/article/:articleId", async (req, res) => {
  const id = req.params.articleId;
  const article = await prisma.article.findUnique({
    where: {
      id: Number(id),
    },
  });
  res.send(article);
});

//게시글 등록 api
app.post("/article", async (req, res) => {
  const newArticle = await prisma.article.create({
    data: req.body,
  });
  res.status(201).send(newArticle);
});

//게시글 수정 api
app.patch("/article/:articleId", async (req, res) => {
  const id = Number(req.params.articleId);
  const updatedArticle = await prisma.article.update({
    data: req.body,
    where: {
      id: id,
    },
  });
  res.send(updatedArticle);
});

//게시글 삭제 api
app.delete("/article/:articleId", async (req, res) => {
  const id = Number(req.params.articleId);
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
app.post("/article/:articleId/comment", async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;
  const newComment = await prisma.comment.create({
    data: { articleId: Number(articleId), content },
  });
  res.status(201).send(newComment);
});
//댓글 조회 api
app.get("/article/:articleId/comments", async (req, res) => {
  const { articleId } = req.params;

  const { limit = 5, offset = 0, order = "new" } = req.query;
  const comments = await prisma.comment.findMany({
    take: Number(limit),
    skip: Number(offset),
    orderBy: {
      createdAt: order === "new" ? "desc" : "asc",
    },
    where: {
      articleId: Number(articleId),
    },
  });
  res.send(comments);
});

//댓글 수정 api
app.patch("comment/:commentId", async (req, res) => {
  const { commentId } = req.params;
  const updatedComment = await prisma.comment.update({
    data: req.body,
    where: {
      id: Number(commentId),
    },
  });
  res.send(updatedComment);
});

//댓글 삭제 api
app.delete("/comment/:commentId", async (req, res) => {
  const id = req.params.commentId;
  const comment = await prisma.articleComment.findUnique({
    where: {
      id: Number(id),
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

app.listen(process.env.HTTP_PORT || 8000, () => console.log("Server started"));
