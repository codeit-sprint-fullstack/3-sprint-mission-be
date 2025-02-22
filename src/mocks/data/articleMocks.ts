export const articleMocks = Array.from({ length: 10 }, (_, index) => {
  const value = index + 1;
  return {
    id: value,
    title: `게시글 ${value}`,
    content: `게시글 ${value} 입니다.`,
    images: [],
    userId: value,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 11 + value)),
  };
});
