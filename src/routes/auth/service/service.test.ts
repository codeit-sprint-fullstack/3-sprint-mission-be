import { prismaTestClient } from '@/jest.setup';
import UserRepository from '@/routes/user/repository/userRepository';
import { AuthService } from './service';
import { ConflictException } from '@/core/errors/httpException';
import { EXCEPTION_MESSAGES } from '@/constants/exceptionMessages';
import bcrypt from 'bcrypt';
import { UnauthorizedException } from '@/core/errors/httpException';
import { AUTH_MESSAGES } from '@/constants/authMessages';

jest.mock('@/routes/user/repository/userRepository');
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('authService', () => {
  const userRepository = new UserRepository(prismaTestClient) as jest.Mocked<UserRepository>;
  const authService = new AuthService(userRepository, 'abcd');

  const signUpForm = {
    email: 'test@email.com',
    nickname: 'test',
    password: '12345678',
  };

  const signInForm = {
    email: 'test@email.com',
    password: '1234567890',
  };

  const mockUser = {
    email: 'test@email.com',
    nickname: 'test',
    image: null,
    encryptedPassword: '12345678',
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 1,
  };

  const userWithSameEmail = {
    email: 'test@email.com',
    nickname: 'test2',
    image: null,
    encryptedPassword: '12345678',
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 2,
  };

  const userWithSameNickname = {
    email: 'test2@email.com',
    nickname: 'test',
    image: null,
    encryptedPassword: '12345678',
    createdAt: new Date(),
    updatedAt: new Date(),
    id: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userRepository.findByEmail.mockReset();
    userRepository.findByNickname.mockReset();
    userRepository.create.mockReset();
  });

  test('회원가입 성공', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);
    userRepository.findByNickname.mockResolvedValueOnce(null);
    userRepository.create.mockResolvedValueOnce(mockUser);

    const result = await authService.signUp({
      email: mockUser.email,
      nickname: mockUser.nickname,
      password: mockUser.encryptedPassword,
    });

    expect(bcrypt.hash).toHaveBeenCalledWith(mockUser.encryptedPassword, 10);
    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.user).toBeDefined();
  });

  test('중복된 이메일로 회원가입 시 실패', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(userWithSameEmail);
    userRepository.findByNickname.mockResolvedValueOnce(null);
    userRepository.create.mockResolvedValueOnce(mockUser);

    expect(authService.signUp(signUpForm)).rejects.toThrow(
      new ConflictException(EXCEPTION_MESSAGES.duplicatedEmail),
    );
  });

  test('중복된 닉네임으로 회원가입 시 실패', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(null);
    userRepository.findByNickname.mockResolvedValueOnce(userWithSameNickname);
    userRepository.create.mockResolvedValueOnce(mockUser);

    await expect(authService.signUp(signUpForm)).rejects.toThrow(
      new ConflictException(EXCEPTION_MESSAGES.duplicatedNickname),
    );
  });

  test('로그인 성공', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authService.signIn(signInForm);

    expect(result.accessToken).toEqual(expect.any(String));
    expect(result.refreshToken).toEqual(expect.any(String));
    expect(result.user).toBeDefined();
    expect(result.user.toJSON().email).toBe(signInForm.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(signInForm.password, mockUser.encryptedPassword);
  });

  test('로그인 실패:존재하지 않는 이메일', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await expect(authService.signIn(signInForm)).rejects.toThrow(
      new UnauthorizedException(AUTH_MESSAGES.emailNotExist),
    );
  });

  test('로그인 실패:잘못된 비밀번호', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(authService.signIn(signInForm)).rejects.toThrow(
      new UnauthorizedException(AUTH_MESSAGES.invalidPassword),
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(signInForm.password, mockUser.encryptedPassword);
  });
});
