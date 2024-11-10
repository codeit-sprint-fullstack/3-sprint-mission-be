import { prisma } from '../prismaClient';
import { asyncHandler } from '../asyncHandler';

// 게시글 등록 API
const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const data = {
    title,
    content,
  };

  const article = await prisma.article.create({
    data,
  });

  res.status(201).send(article);
});

// 게시글 조회 API
const getArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
  });
  res.send(article);
});

// 게시글 수정 API
const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const data = {
    title,
    content,
  };

  const article = await prisma.article.update({
    where: { id },
    data,
  });

  res.send(article);
});

// 게시글 삭제 API
const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.article.delete({
    where: { id },
  });
  res.send({ message: '게시글 삭제 성공' });
});

type GetArticleListReqQueryProps = {
  offset?: string;
  limit?: string;
  orderBy?: string;
  keyword?: string;
};

// 게시글 목록 조회 API
const getArticleList = asyncHandler(async (req, res) => {
  const {
    offset = 0,
    limit = 10,
    orderBy = 'recent',
    keyword = '',
  } = req.query as GetArticleListReqQueryProps;
  const articles = await prisma.article.findMany({
    skip: Number(offset),
    take: Number(limit),
    orderBy: { createdAt: orderBy === 'recent' ? 'desc' : 'asc' },
    where: {
      OR: [
        {
          title: {
            contains: keyword,
            mode: 'insensitive', // 대소문자 구분 없이 검색
          },
        },
        {
          content: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      ],
    },
    select: { id: true, title: true, content: true, createdAt: true }, // id, title, content, createdAt만 조회
  });

  res.send(articles);
});

const service = {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  getArticleList,
};

export default service;
