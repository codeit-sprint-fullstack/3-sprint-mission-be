import { Request, Response } from 'express';
import { prismaClient } from '../../prismaClient';
import { create } from 'superstruct';
import {
  CreateArticleRequest,
  CreateArticleRequestStruct,
  EditArticleRequest,
  EditArticleRequestStruct,
  GetArticleListRequest,
  GetArticleListRequestStruct,
} from '../../structs/ArticleStruct';
import { EXCEPTION_MESSAGES } from '../../constants/ExceptionMessages';
import Article from '../../models/article';
import {
  CreateCommentRequest,
  CreateCommentStruct,
  GetCommentListRequest,
  GetCommentListStruct,
} from '../../structs/CommentStruct';
import { Comment } from '../../models/comment';
import { parseId } from '../../utils/parseId';
import ArticleRepository from '../../repositories/articleRepository';
import LikeRepository from '../../repositories/likeRepository';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import CommentRepository from '../../repositories/commentRepository';
import { ConflictException, ForbiddenException, NotFoundException } from '../../errors';
import { PrismaClient } from '@prisma/client';

const articleRepository = new ArticleRepository();
const likeRepository = new LikeRepository();
const commentRepository = new CommentRepository();

export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private likeRepository: LikeRepository,
    private commentRepository: CommentRepository,
    private prisma: PrismaClient,
  ) {}

  async postArticle(userId: number, createArticleDto: CreateArticleRequest) {
    const articleEntity = await this.articleRepository.create(userId, createArticleDto);
    return new Article({ ...articleEntity, isLiked: false });
  }

  async getArticleById(articleId: number, userId: number) {
    const articleEntity = await this.articleRepository.findById(articleId);

    if (!articleEntity) {
      throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);
    }

    const isLiked = await this.likeRepository.findIsLiked(articleId, userId);
    return new Article({ ...articleEntity, isLiked });
  }

  async editArticle(articleId: number, userId: number, editArticleRequestDto: EditArticleRequest) {
    const articleEntity = await this.articleRepository.update(articleId, editArticleRequestDto);
    const isLiked = await this.likeRepository.findIsLiked(articleId, userId);
    return new Article({ ...articleEntity, isLiked });
  }

  async deleteArticle(articleId: number, userId: number) {
    const existingArticle = await this.articleRepository.findById(articleId);
    if (!existingArticle) throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);
    if (existingArticle.userId !== userId) throw new ForbiddenException(AUTH_MESSAGES.delete);
    await this.articleRepository.delete(articleId);
  }

  async getArticleList(userId: number, getArticleListDto: GetArticleListRequest) {
    const articleListResult = await this.articleRepository.getArticleList(getArticleListDto);

    const articles = await Promise.all(
      articleListResult.list.map(async (articleEntity) => {
        if (!userId) return new Article({ ...articleEntity, isLiked: false });
        const isLiked = await likeRepository.findIsLiked(articleEntity.id, userId);
        return new Article({ ...articleEntity, isLiked });
      }),
    );

    return {
      ...articleListResult,
      list: articles,
    };
  }

  async postArticleComment(articleId: number, userId: number, content: CreateCommentRequest) {
    const existingArticle = await this.articleRepository.findById(articleId);
    if (!existingArticle) throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);

    if (!userId || existingArticle.userId !== userId)
      throw new ForbiddenException(AUTH_MESSAGES.create);

    const commentEntity = await this.commentRepository.createArticleComment(
      articleId,
      userId,
      content,
    );

    return new Comment(commentEntity);
  }

  async getArticleComments(articleId: number, getCommentListDto: GetCommentListRequest) {
    const existingArticle = articleRepository.findById(articleId);
    if (!existingArticle) throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);

    const getCommentListResult = await this.commentRepository.findComments(getCommentListDto);

    const comments = getCommentListResult.comments.map((comment) => new Comment(comment));

    return {
      ...getCommentListResult,
      comments,
    };
  }

  async setLike(articleId: number, userId: number) {
    const existingArticle = this.articleRepository.findById(articleId);

    if (!existingArticle) throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);

    if (await this.likeRepository.findIsLiked(articleId, userId))
      throw new ConflictException('이미 좋아요가 눌린 게시글입니다.');

    const articleEntity = await this.prisma.$transaction(async (t) => {
      await this.likeRepository.setLike(articleId, userId);
      const article = await articleRepository.incrementLikeCount(articleId);
      return article;
    });

    return new Article({ ...articleEntity, isLiked: true });
  }

  async deleteLike(articleId: number, userId: number) {
    const existingArticle = this.articleRepository.findById(articleId);

    if (!existingArticle) throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);

    if (!(await this.likeRepository.findIsLiked(articleId, userId)))
      throw new ConflictException('이미 좋아요가 취소된 게시글입니다.');

    const articleEntity = await this.prisma.$transaction(async (t) => {
      await this.likeRepository.deleteLike(articleId, userId);
      const article = await articleRepository.decrementLikeCount(articleId);
      return article;
    });

    return new Article({ ...articleEntity, isLiked: false });
  }
}
