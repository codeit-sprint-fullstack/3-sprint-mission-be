export const userMocks = Array.from({ length: 10 }, (_, index) => {
  const value = index + 1;
  return {
    id: value,
    email: `user${value}@email.com`,
    nickname: `유저${value}`,
    image: null,
    encryptedPassword: '12345678',
  };
});
