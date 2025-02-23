import CommentRepository from '@/routes/Comments/repository/commentRepository';
import ArticleRepository from '../repository/articleRepository';
import LikeRepository from '../repository/likeRepository';
import { ArticleService } from './service';
import { PrismaClient } from '@prisma/client';
import { ConflictException, NotFoundException } from '@/core/errors';

jest.mock('@/routes/Articles/repository/articleRepository');
jest.mock('@/routes/Articles/repository/likeRepository');
jest.mock('@/routes/Comments/repository/commentRepository');

describe('ArticleService', () => {
  const prismaClient = new PrismaClient();
  const articleRepository = new ArticleRepository(prismaClient) as jest.Mocked<ArticleRepository>;
  const likeRepository = new LikeRepository(prismaClient) as jest.Mocked<LikeRepository>;
  const commentRepository = new CommentRepository(prismaClient) as jest.Mocked<CommentRepository>;
  const articleService = new ArticleService(
    articleRepository,
    likeRepository,
    commentRepository,
    prismaClient,
  );

  const mockArticleWithLike = {
    id: 1,
    title: '게시글 1',
    content: '게시글 1',
    images: [],
    user: {
      id: 1,
      image: '',
      nickname: 'user 1',
    },
    likes: [{ userId: 1 }],
    _count: { likes: 1 },
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockArticleWithoutLike = {
    id: 1,
    title: '게시글 1',
    content: '게시글 1',
    images: [],
    user: {
      id: 1,
      image: '',
      nickname: 'user 1',
    },
    likes: [],
    _count: { likes: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('좋아요 테스트', () => {
    test('좋아요가 눌린 게시글에 대한 좋아요를 눌렀을 때 에러 발생', async () => {
      articleRepository.findById.mockResolvedValue(mockArticleWithLike);

      await expect(articleService.setLike(mockArticleWithLike.id, 1)).rejects.toThrow(
        ConflictException,
      );
    });

    test('좋아요가 눌리지 않은 게시글에 대한 좋아요를 눌렀을 때 정상 처리', async () => {
      articleRepository.findById.mockResolvedValue(mockArticleWithoutLike);

      expect(await articleService.setLike(mockArticleWithLike.id, 1)).resolves;
    });

    test('좋아요가 눌리지 않은 게시글에 좋아요 취소를 눌렀을 때 에러 발생', async () => {
      articleRepository.findById.mockResolvedValue(mockArticleWithoutLike);

      await expect(articleService.deleteLike(mockArticleWithoutLike.id, 1)).rejects.toThrow(
        ConflictException,
      );
    });

    test('좋아요가 눌린 게시글에 좋아요 취소를 눌렀을 때 정상 처리', async () => {
      articleRepository.findById.mockResolvedValue(mockArticleWithLike);

      expect(await articleService.deleteLike(mockArticleWithLike.id, 1)).resolves;
    });
  });

  describe('getArticleById 테스트', () => {
    test('Article이 없을 때 에러 발생', async () => {
      const mockArticle = null;
      articleRepository.findById.mockResolvedValue(mockArticle);

      await expect(articleService.getArticleById(1, 1)).rejects.toThrow(NotFoundException);
    });
    test('좋아요가 존재할 때 리턴 값', async () => {
      articleRepository.findById.mockResolvedValue(mockArticleWithLike);
      const result = (await articleService.getArticleById(1, 1)).toJSON();

      expect(result.likeCount).toBe(1);
      expect(result.isLiked).toBe(true);
    });
    test('좋아요가 존재하지 않을 때 리턴 값', async () => {
      articleRepository.findById.mockResolvedValue(mockArticleWithoutLike);
      const result = (await articleService.getArticleById(1, 1)).toJSON();

      expect(result.likeCount).toBe(0);
      expect(result.isLiked).toBe(false);
    });
  });
});
