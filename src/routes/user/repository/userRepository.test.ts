import { prismaTestClient } from '@/jest.setup';
import { clearMocks } from '@/mocks/service/clearMocks';
import { mockUser } from '@/mocks/service/mockUser';
import UserRepository from './userRepository';

describe('userRepository', () => {
  const userRepository = new UserRepository(prismaTestClient);

  beforeAll(async () => {
    await prismaTestClient.$transaction(async (tx) => {
      await clearMocks(tx);
      await mockUser(tx);
    });
  });
  test('email로 찾기', async () => {
    // given
    const EMAIL = 'user1@email.com';

    // when
    const result = await userRepository.findByEmail(EMAIL);

    // then
    expect(result?.email).toBe(EMAIL);
  });

  test('nickname으로 찾기', async () => {
    const NICKNAME = '유저1';

    const result = await userRepository.findByNickname(NICKNAME);

    expect(result?.nickname).toBe(NICKNAME);
  });

  test('id로 찾기', async () => {
    // given
    const ID = 1;

    // when
    const result = await userRepository.findById(ID);

    // then
    expect(result?.id).toBe(ID);
  });

  test('유저 생성', async () => {
    // given
    const userMock = {
      email: 'mockUser@email.com',
      nickname: 'mock user',
      image: null,
      encryptedPassword: '12345678',
    };

    // when
    const result = await userRepository.create(userMock);

    // then
    expect(result).toEqual({
      ...userMock,
      id: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
