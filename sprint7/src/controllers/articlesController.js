import { skip } from "@prisma/client/runtime/library";
import prisma from "../prismaClient";

// 게시글 목록 조회
export const listArticles = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 5,
      search = "",
      orderBy = "recent"
    } = req.query;
    const offset = (page -1) * limit;

    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: {contains: search }},
          { content: {contains: search }},
        ],
      },
      orderBy: orderBy === "recnet" ? { createdAt: "desc" } : undefined,
      skip: offset,
      take: parseInt(limit),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    res.status(200).json(articles);
  } catch (error) {
    next(error)
  }
}

// 게시글 생성
export const createArticle = async (req, res, next) => {
try {
  const {
    title, content
  } = req.body;
  const newArticle = await prisma.article.create({ data: {title, content } });
  res.status(200).json(newArticle);
} catch (error) {
  next(error);
}
}

// 게시글 조회
export const getArticle = async (req, res, next) => {
  try{
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(req.params.id)
      }
    });
    res.status(200).json(article)
  } catch(error) {
    next(error)
  }
}

// 게시글 수정
export const updateArticle = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const updataArticle = await prisma.article.update({
      where: {
        id: parseInt(req.params.id)
      },
      data: { title, content }
    });
    res.status(200).json(updataArticle)
  } catch(error) {
    next(error)
  }
}

// 게시글 삭제
export const deleteArticle = async (req, res, next) => {
  try {
    await prisma.article.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    next(error)
  }
}