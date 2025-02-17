import initDB from '@prismaDir/seed';
import ArticleRepository from './articleRepository';
import { prismaTestClient } from '@/jest.setup';

describe('ArticleRepository', () => {
  let articleRepository: ArticleRepository = new ArticleRepository(prismaTestClient);

  beforeAll(async () => {
    await initDB(prismaTestClient);
  });

  describe('게시물 생성,삭제,수정 테스트', () => {
    afterEach(async () => {
      await initDB(prismaTestClient);
    });

    test('정상적으로 게시물 생성', async () => {
      const articleData = {
        title: 'Test Article',
        content: 'Test Content',
        images: [],
      };

      const createdArticle = await articleRepository.create(1, articleData);

      expect(createdArticle).toBeDefined();
      expect(createdArticle.title).toBe(articleData.title);
      expect(createdArticle.content).toBe(articleData.content);
      expect(createdArticle.userId).toBe(1);
      expect(createdArticle.user).toBeDefined();
      expect(createdArticle.user.nickname).toBe('유저1');
      expect(createdArticle._count.likes).toBe(0);
      expect(createdArticle.likes).toHaveLength(0);
    });

    test('정상적으로 게시물 삭제', async () => {
      const articleBeforeDelete = await articleRepository.findById(1, 1);
      await articleRepository.delete(1);
      const articleAfterDelete = await articleRepository.findById(1, 1);

      expect(articleBeforeDelete).not.toBeNull();
      expect(articleBeforeDelete.id).toBe(1);
      expect(articleAfterDelete).toBeNull();
    });

    test('정상적으로 게시물 수정', async () => {
      const articleBeforeEdit = await articleRepository.findById(1, 1);
      const updateContent = {
        title: '수정된 게시물',
        content: '수정된 내용',
      };
      const articleAfterEdit = await articleRepository.update(1, 1, updateContent);

      expect(articleAfterEdit.title).toBe(updateContent.title);
      expect(articleAfterEdit.content).toBe(updateContent.content);
      expect(articleBeforeEdit.updatedAt.getTime()).toBeLessThan(
        articleAfterEdit.updatedAt.getTime(),
      );
      expect(articleAfterEdit.id).toBe(articleAfterEdit.id);
    });
  });

  describe('게시물 조회 테스트', () => {
    test('게시물 조회', async () => {
      const response = await articleRepository.findById(1, 1);
      expect(response.id).toBe(1);
    });

    test('최신순 정렬', async () => {
      const response = await articleRepository.getArticleList({
        page: 1,
        pageSize: 10,
        orderBy: 'recent',
      });

      expect(response.list[0].createdAt.getTime()).toBeGreaterThan(
        response.list[1].createdAt.getTime(),
      );
    });

    test('좋아요순 정렬', async () => {
      const response = await articleRepository.getArticleList({
        page: 1,
        pageSize: 10,
        orderBy: 'like',
      });

      expect(response.list[0]._count.likes).toBeGreaterThan(response.list[1]._count.likes);
    });

    test.each([1, 5, 10])('pageSize가 %i일 때 조회되는 갯수 확인', async (pageSize) => {
      const response = await articleRepository.getArticleList({
        page: 1,
        pageSize,
        orderBy: 'like',
      });

      expect(response.list.length).toBe(pageSize);
    });

    test.each(['게시글 1', '게시글 5', '게시글 10'])('word가 %s일 때 일치 여부', async (word) => {
      const response = await articleRepository.getArticleList({
        page: 1,
        pageSize: 10,
        orderBy: 'like',
        word,
      });
      const searchRegex = new RegExp(word);

      response.list.forEach((article) => {
        expect(searchRegex.test(article.content) || searchRegex.test(article.title)).toBe(true);
      });
    });
  });
});
