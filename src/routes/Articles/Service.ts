import {
  CreateArticleRequest,
  EditArticleRequest,
  GetArticleListRequest,
} from '../../structs/ArticleStruct';
import { EXCEPTION_MESSAGES } from '../../constants/ExceptionMessages';
import Article from '../../models/article';
import { CreateCommentRequest, GetCommentListRequest } from '../../structs/CommentStruct';
import { Comment } from '../../models/comment';
import ArticleRepository from '../../repositories/articleRepository';
import LikeRepository from '../../repositories/likeRepository';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import CommentRepository from '../../repositories/commentRepository';
import { ConflictException, ForbiddenException, NotFoundException } from '../../errors';
import { PrismaClient } from '@prisma/client';
export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private likeRepository: LikeRepository,
    private commentRepository: CommentRepository,
    private prisma: PrismaClient,
  ) {}

  private async getExistingArticle(articleId: number) {
    const existingArticle = await this.articleRepository.findById(articleId);
    if (!existingArticle) throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);
    return existingArticle;
  }

  private async validateAuth(articleUserId: number, userId: number, message: string) {
    if (articleUserId !== userId) throw new ForbiddenException(message);
  }

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
    const existingArticle = await this.getExistingArticle(articleId);
    await this.validateAuth(existingArticle.userId, articleId, AUTH_MESSAGES.update);

    const articleEntity = await this.articleRepository.update(articleId, editArticleRequestDto);
    const isLiked = await this.likeRepository.findIsLiked(articleId, userId);
    return new Article({ ...articleEntity, isLiked });
  }

  async deleteArticle(articleId: number, userId: number) {
    const existingArticle = await this.getExistingArticle(articleId);
    await this.validateAuth(existingArticle.userId, articleId, AUTH_MESSAGES.delete);
    await this.articleRepository.delete(articleId);
  }

  async getArticleList(userId: number, getArticleListDto: GetArticleListRequest) {
    const articleListResult = await this.articleRepository.getArticleList(getArticleListDto);

    const articles = await Promise.all(
      articleListResult.list.map(async (articleEntity) => {
        if (!userId) return new Article({ ...articleEntity, isLiked: false });
        const isLiked = await this.likeRepository.findIsLiked(articleEntity.id, userId);
        return new Article({ ...articleEntity, isLiked });
      }),
    );

    return {
      ...articleListResult,
      list: articles,
    };
  }

  async postArticleComment(articleId: number, userId: number, content: CreateCommentRequest) {
    await this.getExistingArticle(articleId);

    const commentEntity = await this.commentRepository.createArticleComment(
      articleId,
      userId,
      content,
    );

    return new Comment(commentEntity);
  }

  async getArticleComments(articleId: number, getCommentListDto: GetCommentListRequest) {
    await this.getExistingArticle(articleId);

    const getCommentListResult = await this.commentRepository.findComments({
      ...getCommentListDto,
      articleId,
    });
    const comments = getCommentListResult.comments.map((comment) => new Comment(comment));

    return {
      ...getCommentListResult,
      list: comments,
    };
  }

  async setLike(articleId: number, userId: number) {
    await this.getExistingArticle(articleId);

    if (await this.likeRepository.findIsLiked(articleId, userId))
      throw new ConflictException('이미 좋아요가 눌린 게시글입니다.');

    const articleEntity = await this.prisma.$transaction(async (t) => {
      await this.likeRepository.setLike(articleId, userId);
      const article = await this.articleRepository.incrementLikeCount(articleId);
      return article;
    });

    return new Article({ ...articleEntity, isLiked: true });
  }

  async deleteLike(articleId: number, userId: number) {
    await this.getExistingArticle(articleId);

    if (!(await this.likeRepository.findIsLiked(articleId, userId)))
      throw new ConflictException('이미 좋아요가 취소된 게시글입니다.');

    const articleEntity = await this.prisma.$transaction(async (t) => {
      await this.likeRepository.deleteLike(articleId, userId);
      const article = await this.articleRepository.decrementLikeCount(articleId);
      return article;
    });

    return new Article({ ...articleEntity, isLiked: false });
  }
}
