import express from 'express';
import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../structs.js';
import { prisma } from '../prismaClient.js'; // 경로 수정

const router = express.Router();

router.post("/", async (req, res) => {
    const createComment = await prisma.productComment.create({
        data: {
            content: req.body.content,
        }
    });
    res.status(201).send(createComment);
});

router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const updateProductComment = await prisma.productComment.update({
        data: req.body,
        where: {
            id,
        },
    });
    res.status(201).send(updateProductComment);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.productComment.delete({
        where: {
            id,
        },
    });
    res.sendStatus(204);
});

router.get("/", async (req, res) => {
    const { limit = 10 } = req.query;
    const comments = await prisma.productComment.findMany({
        orderBy: { createdAt: "asc" },
        take: parseInt(limit),
    });
    res.status(201).send(comments);
});

router.post("/:articleId/comments", async (req, res) => {
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
            },
        });
    });

    res.status(201).send(commentEntity);
});

router.patch("/articles/comment/:id", async (req, res) => {
    const { id } = req.params;
    const numId = parseInt(id, 10);
    assert(req.body, PatchComment);
    const updateArticleComment = await prisma.articleComment.update({
        data: req.body,
        where: {
            id: numId,
        },
    });
    res.status(201).send(updateArticleComment);
});

router.delete("/articles/comment/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const idNum = parseInt(id, 10);
        if (isNaN(idNum)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const comment = await prisma.articleComment.findUnique({
            where: { id: idNum },
        });

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        await prisma.articleComment.delete({
            where: { id: idNum },
        });

        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ error: "An error occurred while deleting the comment" });
    }
});

router.get("/articles/:articleId/comment", async (req, res) => {
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
