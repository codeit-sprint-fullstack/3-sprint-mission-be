import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

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

app.get('/articleList', asyncHandler(async (req, res) => {
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
}));

//게시글id로 조회 ,  id, title, content, createdAt를 조회
app.get('/article/:id', asyncHandler(async (req, res) => {
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
}));

//게시글 생성, title, content
app.post('/article', asyncHandler(async (req, res) => {
    const article = await prisma.article.create({
        data: req.body,
    });
    res.status(201).send(article);
}));

//게시글id로 게시글 수정
app.patch('/article/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.update({
        where: { id },
        data: req.body,
    });
    res.send(article);
}));

//게시글 id로 게시글 삭제, 게시글이 사라지면 댓글도 사라짐
app.delete('/article/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
        where: { id },
    });
    res.sendStatus(204);
}));


//-------------------
//-------------------댓글

//댓글 목록 조회
app.get('/articleComment', asyncHandler(async (req, res) => {
    const articleComment = await prisma.articleComment.findMany({
        select: {
            id: true,
            content: true,
            createdAt: true,
        }
    });

    res.send(articleComment);
}));

// 게시글 id로 댓글 조회
app.get('/articleComment/:articleId', asyncHandler(async (req, res) => {
    const { articleId } = req.params;
    const articleComment = await prisma.articleComment.findMany({
        where: { articleId },
    });
    res.send(articleComment);
}));

//댓글 생성, 게시글id로 게시글에 댓글 생성
app.post('/articleComment', asyncHandler(async (req, res) => {
    const { content, articleId } = req.body;

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
}));

//댓글 id로 댓글 수정
app.patch('/articleComment/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.articleComment.update({
        where: { id },
        data: req.body,
    });
    res.send(article);
}));

//댓글 id로 댓글 삭제
app.delete('/articleComment/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.articleComment.delete({
        where: { id },
    });
    res.sendStatus(204);
}));



app.listen(process.env.PORT || 8000, () => console.log('서버가 시작되었습니다~'));
