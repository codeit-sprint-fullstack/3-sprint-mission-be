import {
  CreateArticleRequest,
  EditArticleRequest,
  GetArticleListRequest,
} from '@/structs/articleStruct';
import { EXCEPTION_MESSAGES } from '@/constants/exceptionMessages';
import Article from '@/routes/Articles/model/article';
import { CreateCommentRequest, GetCommentListRequest } from '@/structs/commentStruct';
import { Comment } from '@/routes/Comments/model/comment';
import ArticleRepository from '@/routes/Articles/repository/articleRepository';
import LikeRepository from '@/routes/Articles/repository/likeRepository';
import { AUTH_MESSAGES } from '@/constants/authMessages';
import CommentRepository from '@/routes/Comments/repository/commentRepository';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@/core/errors/httpException';
import { PrismaClient } from '@prisma/client';

export class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private likeRepository: LikeRepository,
    private commentRepository: CommentRepository,
    private prisma: PrismaClient,
  ) {}

  private async getExistingArticle(articleId: number, userId: number) {
    const existingArticle = await this.articleRepository.findById(articleId, userId);
    if (!existingArticle) throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);
    return existingArticle;
  }

  private async validateAuth(articleUserId: number, userId: number, message: string) {
    if (articleUserId !== userId) throw new ForbiddenException(message);
  }

  async postArticle(userId: number, createArticleDto: CreateArticleRequest) {
    const { _count, ...articleData } = await this.articleRepository.create(
      userId,
      createArticleDto,
    );
    return new Article({ ...articleData, likeCount: _count.likes, isLiked: false });
  }

  async getArticleById(articleId: number, userId: number) {
    const articleEntity = await this.articleRepository.findById(articleId, userId);
    if (!articleEntity) {
      throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);
    }
    const { _count, likes, ...articleData } = articleEntity;

    return new Article({ ...articleData, likeCount: _count.likes, isLiked: likes.length > 0 });
  }

  async editArticle(articleId: number, userId: number, editArticleRequestDto: EditArticleRequest) {
    const existingArticle = await this.getExistingArticle(articleId, userId);
    await this.validateAuth(existingArticle.userId, articleId, AUTH_MESSAGES.update);

    const { _count, likes, ...articleData } = await this.articleRepository.update(
      articleId,
      userId,
      editArticleRequestDto,
    );
    return new Article({ ...articleData, likeCount: _count.likes, isLiked: likes.length > 0 });
  }

  async deleteArticle(articleId: number, userId: number) {
    const existingArticle = await this.getExistingArticle(articleId, userId);
    await this.validateAuth(existingArticle.userId, articleId, AUTH_MESSAGES.delete);
    await this.articleRepository.delete(articleId);
  }

  async getArticleList(getArticleListDto: GetArticleListRequest) {
    const articleListResult = await this.articleRepository.getArticleList(getArticleListDto);

    const articles = articleListResult.list.map((article) => {
      const { _count, likes, ...articleData } = article;
      return new Article({
        ...articleData,
        likeCount: _count.likes,
        isLiked: false,
      });
    });

    return {
      ...articleListResult,
      list: articles,
    };
  }

  async postArticleComment(articleId: number, userId: number, content: CreateCommentRequest) {
    await this.getExistingArticle(articleId, userId);

    const commentEntity = await this.commentRepository.createArticleComment(
      articleId,
      userId,
      content,
    );

    return new Comment(commentEntity);
  }

  async getArticleComments(
    articleId: number,
    userId: number,
    getCommentListDto: GetCommentListRequest,
  ) {
    await this.getExistingArticle(articleId, userId);

    const getCommentListResult = await this.commentRepository.findComments({
      ...getCommentListDto,
      articleId,
    });
    const comments = Comment.fromList(getCommentListResult.comments);

    return {
      ...getCommentListResult,
      list: comments,
    };
  }

  async setLike(articleId: number, userId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const article = await this.articleRepository.findById(articleId, userId, tx);
      if (!article) throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);
      if (article.likes.length > 0) throw new ConflictException('이미 좋아요가 눌린 게시글입니다.');

      await this.likeRepository.setLike(articleId, userId, tx);

      return new Article({
        ...article,
        likeCount: article._count.likes + 1,
        isLiked: true,
      });
    });
  }

  async deleteLike(articleId: number, userId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const article = await this.articleRepository.findById(articleId, userId, tx);
      if (!article) throw new NotFoundException(EXCEPTION_MESSAGES.articleNotFound);
      if (article.likes.length === 0)
        throw new ConflictException('이미 좋아요가 취소된 게시글입니다.');

      await this.likeRepository.deleteLike(articleId, userId, tx);

      return new Article({
        ...article,
        likeCount: article._count.likes - 1,
        isLiked: false,
      });
    });
  }
}
