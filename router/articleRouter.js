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

//--------------- 게시글 목록 조회
// id, title, content, createdAt를 조회 , 한 화면에 보이는 목록 5개로 임의설정, 
// title, content로 검색가능하게 설정
const getArticleList = asyncHandler(async (req, res) => {
    try {
        const { page = 1, pageSize = 5, orderBy = "recent", keyword = "" } = req.query;
        const searchQuery = keyword ? {
            OR: [
                { title: { contains: keyword, mode: 'insensitive' } }, //postgres에서 대소문자 구분하지않게 설정
                { content: { contains: keyword, mode: 'insensitive' } },
            ]
        } : {};

        const sortOption = orderBy === "recent" ? { createdAt: 'desc' } : { favoriteCount: 'desc' }; //최신순 선택시 최신순으로 정렬하기

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const articles = await prisma.article.findMany({
            where: searchQuery,  // searchQuery를 포함하는지
            orderBy: sortOption, // 최신순 정렬
            skip: offset,  //offset
            take: limit,   // limit
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            }
        });
        res.status(200).json({
            Articles: articles
        });

    } catch (err) {
        res.status(500).send("실패");
    }
});

//게시글id로 조회 ,  id, title, content, createdAt를 조회
const getArticle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findMany({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true
        }
    });
    res.send(article);
});

//게시글 생성, title, content
const postArticleCreate = asyncHandler(async (req, res) => {
    const article = await prisma.article.create({
        data: req.body,
    });
    res.status(201).send(article);
});

//게시글id로 게시글 수정
const patchArticleUpdate = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.update({
        where: { id },
        data: req.body,
    });
    res.send(article);
});

//게시글 id로 게시글 삭제, 게시글이 사라지면 댓글도 사라짐
const deleteArticle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
        where: { id },
    });
    res.sendStatus(204);
});

router.get('/articleList', getArticleList);
router.get('/:id', getArticle);
router.post('/', postArticleCreate);
router.patch('/:id', patchArticleUpdate);
router.delete('/:id', deleteArticle);

export default router;