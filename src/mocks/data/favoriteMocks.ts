export const favoriteMocks = [
  // userId: 1 -> 모든 productId(1~10)에 좋아요
  ...Array.from({ length: 10 }, (_, i) => ({ userId: 1, productId: i + 1 })),

  // userId: 2 -> productId 1~9까지 좋아요
  ...Array.from({ length: 9 }, (_, i) => ({ userId: 2, productId: i + 1 })),

  // userId: 3 -> productId 1~8까지 좋아요
  ...Array.from({ length: 8 }, (_, i) => ({ userId: 3, productId: i + 1 })),

  // userId: 4 -> productId 1~7까지 좋아요
  ...Array.from({ length: 7 }, (_, i) => ({ userId: 4, productId: i + 1 })),

  // userId: 5 -> productId 1~6까지 좋아요
  ...Array.from({ length: 6 }, (_, i) => ({ userId: 5, productId: i + 1 })),

  // userId: 6 -> productId 1~5까지 좋아요
  ...Array.from({ length: 5 }, (_, i) => ({ userId: 6, productId: i + 1 })),

  // userId: 7 -> productId 1~4까지 좋아요
  ...Array.from({ length: 4 }, (_, i) => ({ userId: 7, productId: i + 1 })),

  // userId: 8 -> productId 1~3까지 좋아요
  ...Array.from({ length: 3 }, (_, i) => ({ userId: 8, productId: i + 1 })),

  // userId: 9 -> productId 1~2까지 좋아요
  ...Array.from({ length: 2 }, (_, i) => ({ userId: 9, productId: i + 1 })),

  // userId: 10 -> productId 1만 좋아요
  { userId: 10, productId: 1 },
];
