import express from 'express';
import { assert } from 'superstruct';
import { CreateArticle, PatchArticle } from '../structs.js';
import { prisma } from '../prismaClient.js'; // 경로 수정

const router = express.Router();

router.post("/", async (req, res) => {
    assert(req.body, CreateArticle);
    const createdArticle = await prisma.article.create({
        data: req.body,
    });
    res.status(201).send(createdArticle);
});

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

router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const numId = parseInt(id, 10);
    assert(req.body, PatchArticle);
    const updateArticle = await prisma.article.update({
        data: req.body,
        where: {
            id: numId,
        },
    });
    res.status(201).send(updateArticle);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const idNum = parseInt(id, 10);
    await prisma.article.delete({
        where: {
            id: idNum,
        },
    });
    res.sendStatus(204);
});

router.get("/", async (req, res) => {
    const { offset = 0, limit = 5 } = req.query;
    const articles = await prisma.article.findMany({
        skip: parseInt(offset),
        take: parseInt(limit),
    });

    res.status(200).send(articles);
});

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

export default router;
