import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

function asyncHandler(handler) {
    return async function (req, res) {
        try {
            await handler(req, res);
        } catch (e) {
            if (
                e.name === 'StructError' ||
                e instanceof Prisma.PrismaClientValidationError
            ) {
                res.status(400).send({ message: e.message });
            } else if (
                e instanceof Prisma.PrismaClientKnownRequestError &&
                e.code === 'P2025'
            ) {
                res.sendStatus(404);
            } else {
                res.status(500).send({ message: e.message });
            }
        }
    };
}


//댓글 목록 조회
const getArticleComment = asyncHandler(async (req, res) => {
    const articleComment = await prisma.articleComment.findMany({
        select: {
            id: true,
            content: true,
            createdAt: true,
        }
    });

    res.send(articleComment);
});

// 게시글 id로 댓글 조회
const getArticleCommentId = asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const articleComment = await prisma.articleComment.findMany({
        where: { articleId },
    });
    res.send(articleComment);
});

//댓글 생성, 게시글id로 게시글에 댓글 생성
const postArticleCommentCreate = asyncHandler(async (req, res) => {
    const { articleId } = req.body;

    const article = await prisma.article.findUnique({
        where: { id: articleId },
    });

    const articleComment = await prisma.articleComment.create({
        data: req.body,
    });
    res.status(201).send(articleComment);

    if (!article) {
        return res.status(404).send({ message: '게시글을 찾을 수 없습니다.' });
    }
});

//댓글 id로 댓글 수정
const patchArticleCommentUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.articleComment.update({
        where: { id },
        data: req.body,
    });
    res.send(article);
});

//댓글 id로 댓글 삭제
const deleteArticleComment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.articleComment.delete({
        where: { id },
    });
    res.sendStatus(204);
});

router.get('/', getArticleComment);
router.get('/:articleId', getArticleCommentId);
router.post('/', postArticleCommentCreate);
router.patch('/:id', patchArticleCommentUpdate);
router.delete('/:id', deleteArticleComment);

export default router;