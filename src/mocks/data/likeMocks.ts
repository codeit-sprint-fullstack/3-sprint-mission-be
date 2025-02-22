export const likeMocks = [
  // userId: 1 -> 모든 articleId(1~10)에 좋아요
  ...Array.from({ length: 10 }, (_, i) => ({ userId: 1, articleId: i + 1 })),

  // userId: 2 -> articleId 1~9까지 좋아요
  ...Array.from({ length: 9 }, (_, i) => ({ userId: 2, articleId: i + 1 })),

  // userId: 3 -> articleId 1~8까지 좋아요
  ...Array.from({ length: 8 }, (_, i) => ({ userId: 3, articleId: i + 1 })),

  // userId: 4 -> articleId 1~7까지 좋아요
  ...Array.from({ length: 7 }, (_, i) => ({ userId: 4, articleId: i + 1 })),

  // userId: 5 -> articleId 1~6까지 좋아요
  ...Array.from({ length: 6 }, (_, i) => ({ userId: 5, articleId: i + 1 })),

  // userId: 6 -> articleId 1~5까지 좋아요
  ...Array.from({ length: 5 }, (_, i) => ({ userId: 6, articleId: i + 1 })),

  // userId: 7 -> articleId 1~4까지 좋아요
  ...Array.from({ length: 4 }, (_, i) => ({ userId: 7, articleId: i + 1 })),

  // userId: 8 -> articleId 1~3까지 좋아요
  ...Array.from({ length: 3 }, (_, i) => ({ userId: 8, articleId: i + 1 })),

  // userId: 9 -> articleId 1~2까지 좋아요
  ...Array.from({ length: 2 }, (_, i) => ({ userId: 9, articleId: i + 1 })),

  // userId: 10 -> articleId 1만 좋아요
  { userId: 10, articleId: 1 },
];
