export const productMocks = Array.from({ length: 10 }, (_, index) => {
  const value = index + 1;
  return {
    id: value,
    name: `상품 ${value}`,
    description: `상품 ${value} 입니다.`,
    price: 5000,
    images: [],
    userId: value,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 11 + value)),
  };
});
