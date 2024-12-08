import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// 특정 Article에 대한 댓글 조회
router.get("/article/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { articleId: Number(id) },
      orderBy: { createdAt: "asc" }, // 오래된 댓글부터 정렬
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching article comments:", error);
    res.status(500).json({ error: "Article 댓글 가져오기 실패" });
  }
});

// Article에 댓글 등록
router.post("/article/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        articleId: Number(id),
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating article comment:", error);
    res.status(500).json({ error: "Article 댓글 등록 실패" });
  }
});

// Article 댓글 수정
router.patch("/article/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content, updatedAt: new Date() },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating article comment:", error);
    res.status(500).json({ error: "Article 댓글 수정 실패" });
  }
});

// Article 댓글 삭제
router.delete("/article/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.comment.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Error deleting article comment:", error);
    res.status(500).json({ error: "Article 댓글 삭제 실패" });
  }
});

// 특정 Product에 대한 댓글 조회
router.get("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { productId: Number(id) },
      orderBy: { createdAt: "asc" },
    });
    res.json(comments);
  } catch (error) {
    console.error("Error fetching product comments:", error);
    res.status(500).json({ error: "Product 댓글 가져오기 실패" });
  }
});

// Product에 댓글 등록
router.post("/product/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        productId: Number(id),
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating product comment:", error);
    res.status(500).json({ error: "Product 댓글 등록 실패" });
  }
});

// Product 댓글 수정
router.patch("/product/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await prisma.comment.update({
      where: { id: Number(id) },
      data: { content, updatedAt: new Date() },
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error("Error updating product comment:", error);
    res.status(500).json({ error: "Product 댓글 수정 실패" });
  }
});

// Product 댓글 삭제
router.delete("/product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.comment.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Error deleting product comment:", error);
    res.status(500).json({ error: "Product 댓글 삭제 실패" });
  }
});

export default router;
