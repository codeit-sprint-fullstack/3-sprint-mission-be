import express from 'express';
import { prisma } from '../prismaClient.js';
import { assert } from 'superstruct';
import { CreateComment } from '../structs.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

//게시물 조회 상세 조회
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const numId = parseInt(id, 10);
    const article = await prisma.article.findUnique({
        where: {
            id: numId,
        },
    });
    res.send(article);
});

//게시물 조회
router.get("/", async (req, res) => {
    const { offset = 0, limit = 5 } = req.query;
    const articles = await prisma.article.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
    });

    res.status(200).send(articles);
});

//게시물 조회 검색기능
router.get("/search", async (req, res) => {
    const { searchKeyword, offset = 0, limit = 10 } = req.query;
    if (!searchKeyword.trim()) {
        return res.status(404).send({ message: "검색어가 비어 있습니다" });
    }
    const articles = await prisma.article.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
        where: {
            OR: [
                { title: { contains: searchKeyword, mode: "insensitive" } },
                { content: { contains: searchKeyword, mode: "insensitive" } },
            ]
        },
    });
    res.status(201).send(articles);
});

// 게시글 등록 
router.post('/', authenticate, async (req, res) => {
  const { title, content } = req.body;

  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        userId: req.user.userId, // 게시글 등록자
      },
    });

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: '게시글 등록 중 오류가 발생했습니다.', error });
  }
});

// 게시글 수정 
router.patch('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!article || article.userId !== req.user.userId) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }

    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id, 10) },
      data: { title, content },
    });

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: '게시글 수정 중 오류가 발생했습니다.', error });
  }
});

// 게시글 삭제 
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!article || article.userId !== req.user.userId) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await prisma.article.delete({
      where: { id: parseInt(id, 10) },
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: '게시글 삭제 중 오류가 발생했습니다.', error });
  }
});

// '좋아요' 추가 
router.post('/:articleId/like', authenticate, async (req, res) => {
  const { articleId } = req.body;

  try {
    const like = await prisma.like.create({
      data: {
        userId: req.user.userId,
        articleId: parseInt(articleId, 10),
      },
    });

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ message: '좋아요 추가 중 오류가 발생했습니다.', error });
  }
});

// '좋아요' 삭제 
router.delete('/:articleId/like', authenticate, async (req, res) => {
  const { articleId } = req.body;

  try {
    await prisma.like.deleteMany({
      where: {
        userId: req.user.userId,
        articleId: parseInt(articleId, 10),
      },
    });

    res.status(200).json({ message: '좋아요가 취소되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '좋아요 삭제 중 오류가 발생했습니다.', error });
  }
});

// 댓글 등록 
router.post("/:articleId/comments", authenticate, async (req, res) => {
    const { articleId } = req.params;
    const numId = parseInt(articleId, 10);
    const { content } = req.body;
    if (!content) {
        return res.status(400).send({ message: "Content is required." });
    }
    assert(req.body, CreateComment);
    const commentEntity = await prisma.$transaction(async (tx) => {
        const targetArticleEntity = await tx.article.findUnique({
            where: {
                id: numId,
            },
        });
        if (!targetArticleEntity) {
            return res.status(404).send({ message: "Article not found" });
        }
        return await tx.articleComment.create({
            data: {
                articleId: numId,
                content: content,
                userId: req.user.userId, // 댓글 작성자
            },
        });
    });

    res.status(201).send(commentEntity);
});

//게시글 댓글 목록 조회
router.get("/:articleId/comment", async (req, res) => {
    const { articleId } = req.params;
    const numId = parseInt(articleId, 10);
    if (isNaN(numId)) {
        return res.status(400).send({ message: "잘못된 articleId 형식입니다." });
    }

    const comment = await prisma.articleComment.findMany({
        orderBy: { createdAt: "asc" },
        where: {
            articleId: numId,
        },
    });

    res.status(200).send(comment);
});

export default router;





