import express from 'express';
import { prisma } from '../prismaClient.js';

const router = express.Router();

// '좋아요' API
router.post('/', async (req, res) => {
    const { userId, articleId } = req.body;

    if (!articleId) {
        return res.status(404).send({ message: "articleId가 필요합니다." });
    }

    await prisma.$transaction(async (tx) => {
        await tx.like.create({
            data: {
                userId: userId,
                articleId: articleId,
            },
        });
    });

    return res.status(200).send({ message: "좋아요가 추가되었습니다." });
});

// '좋아요' 취소 API
router.delete('/', async (req, res) => {
    const { userId, articleId } = req.body;

    if (!articleId) {
        return res.status(404).send({ message: "articleId가 필요합니다." });
    }

    await prisma.$transaction(async (tx) => {
        await tx.like.deleteMany({
            where: {
                userId: userId,
                articleId: articleId,
            },
        });
    });

    return res.status(200).send({ message: "좋아요가 취소되었습니다." });
});

export default router;
