import express from 'express';
import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../structs.js';
import { prisma } from '../prismaClient.js'; // 경로 수정
import authenticate from '../middleware/auth.js';

const router = express.Router();

// 댓글 수정 엔드포인트
router.patch("/:id", authenticate, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const comment = await prisma.productComment.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!comment || comment.userId !== req.user.userId) {
            return res.status(403).json({ message: '수정 권한이 없습니다.' });
        }

        const updatedComment = await prisma.productComment.update({
            where: { id: parseInt(id, 10) },
            data: { content },
        });

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: '댓글 수정 중 오류가 발생했습니다.', error });
    }
});

// 댓글 삭제 엔드포인트
router.delete("/:id", authenticate, async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await prisma.productComment.findUnique({
            where: { id: parseInt(id, 10) },
        });

        if (!comment || comment.userId !== req.user.userId) {
            return res.status(403).json({ message: '삭제 권한이 없습니다.' });
        }

        await prisma.productComment.delete({
            where: { id: parseInt(id, 10) },
        });

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ message: '댓글 삭제 중 오류가 발생했습니다.', error });
    }
});

// 댓글 목록 조회 엔드포인트
router.get("/", async (req, res) => {
    const { limit = 10 } = req.query;
    const comments = await prisma.productComment.findMany({
        orderBy: { createdAt: "asc" },
        take: parseInt(limit),
    });
    res.status(201).send(comments);
});

export default router;
