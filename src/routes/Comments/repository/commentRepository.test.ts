import { prismaTestClient } from '@/jest.setup';
import CommentRepository from './commentRepository';
import { clearMocks } from '@/mocks/service/clearMocks';
import { mockUser } from '@/mocks/service/mockUser';
import { mockArticle } from '@/mocks/service/mockArticle';

describe.skip('commentRepository', () => {
  const commentRepository = new CommentRepository(prismaTestClient);

  beforeEach(async () => {
    await prismaTestClient.$transaction(async (tx) => {
      await clearMocks(tx);
      await mockUser(tx);
      await mockArticle(tx);
    });
  });

  afterEach(async () => await prismaTestClient.$transaction(async (tx) => await clearMocks(tx)));

  test('댓글 목록 조회', async () => {
    const { comments, hasNextPage, nextCursor } = await commentRepository.findComments({
      articleId: 1,
      take: 5,
    });
    expect(comments).toBeDefined();
    expect(comments.length).toBe(1);
    expect(hasNextPage).toBe(false);
    expect(nextCursor).toBe(null);
  });

  test('댓글 목록 조회:잘못된 파라미터', async () => {
    await expect(
      commentRepository.findComments({
        articleId: 1,
        productId: 1,
        take: 5,
      }),
    ).rejects.toThrow();
  });

  test('게시글에 댓글 생성 테스트', async () => {
    const comment = await commentRepository.createArticleComment(1, 1, {
      content: 'test comment 1',
    });

    expect(comment).toBeDefined();
    expect(comment.content).toBe('test comment 1');
    expect(comment.articleId).toBe(1);
    expect(comment.userId).toBe(1);
  });

  test('댓글 수정 테스트', async () => {
    const originalComment = await commentRepository.findCommentById(1);
    const editedComment = await commentRepository.editComment(1, { content: 'Edited Content' });
    expect(editedComment.id).toBe(originalComment?.id);
    expect(editedComment.userId).toBe(originalComment?.userId);
    expect(editedComment.content).toBe('Edited Content');
    expect(editedComment).toBeDefined();
  });

  test('댓글 삭제 테스트', async () => {
    await commentRepository.deleteComment(1);
    const deletedComment = await commentRepository.findCommentById(1);

    expect(deletedComment).toBe(null);
  });
});
