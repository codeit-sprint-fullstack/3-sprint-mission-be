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

/* ----- 게시글 댓글 관련 API ----- */

// 게시글 댓글 목록 조회 API
const getArticleCommentList = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comments = await prisma.articleComment.findMany({
    where: {
      articleId: id,
    },
    include: {
      user: true, // 댓글 작성자 정보
    },
  });

  res.status(200).send(comments);
});

// 게시글 댓글 등록 API
const createArticleComment = asyncHandler(async (req, res) => {
  const { content, userId, articleId } = req.body;

  const comment = await prisma.articleComment.create({
    data: {
      content,
      user: { connect: { id: userId } }, // 유저 ID
      article: { connect: { id: articleId } }, // 게시글 ID
    },
  });

  res.status(201).send(comment);
});

// 게시글 댓글 수정 API
const updateArticleComment = asyncHandler(async (req, res) => {
  const { id } = req.params; // 댓글 ID
  const { content } = req.body;

  const comment = await prisma.articleComment.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });

  res.status(200).send(comment);
});

// 게시글 댓글 삭제 API
const deleteArticleComment = asyncHandler(async (req, res) => {
  const { id } = req.params; // 댓글 ID

  await prisma.articleComment.delete({
    where: {
      id,
    },
  });

  res.status(200).send({ message: '댓글 삭제 성공' });
});

const service = {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  getArticleList,
  getArticleCommentList,
  createArticleComment,
  updateArticleComment,
  deleteArticleComment,
};

export default service;
