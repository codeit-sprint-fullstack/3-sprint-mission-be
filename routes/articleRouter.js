import express from "express";
import prisma from "../prismaClient.js";

const router = express.Router();

// 게시글 목록 조회
router.get("/", async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// 게시글 상세 조회
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) }, // id는 숫자로 변환
    });

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

// 게시글 생성
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const newArticle = await prisma.article.create({
      data: { title, content },
    });
    res.status(201).json(newArticle);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
});

// 게시글 수정
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({ error: "At least one field is required" });
  }

  try {
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id, 10) }, // id는 숫자로 변환
      data: { ...(title && { title }), ...(content && { content }) },
    });

    res.json(updatedArticle);
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma의 특정 오류 코드
      return res.status(404).json({ error: "Article not found" });
    }
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Failed to update article" });
  }
});

// 게시글 삭제
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.article.delete({
      where: { id: parseInt(id, 10) }, // id는 숫자로 변환
    });
    res.status(204).send(); // 성공적으로 삭제된 경우 응답 본문 없이 상태 코드 204
  } catch (error) {
    if (error.code === "P2025") {
      // Prisma의 특정 오류 코드
      return res.status(404).json({ error: "Article not found" });
    }
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

export default router;
