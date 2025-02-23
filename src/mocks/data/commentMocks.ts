export const productCommentMocks = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  content: `댓글${i + 1}`,
  articleId: null,
  productId: i + 1,
  userId: i + 1,
}));

export const articleCommentMocks = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  content: `댓글${i + 1}`,
  articleId: i + 1,
  productId: null,
  userId: i + 1,
}));
