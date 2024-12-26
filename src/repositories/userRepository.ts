import { prismaClient } from '../prismaClient';
import { CreateUserRequestDto } from '../types/dtos/userDto';

export default class UserRepository {
  async findByEmail(email: string) {
    return await prismaClient.user.findUnique({
      where: { email },
    });
  }

  async findByNickname(nickname: string) {
    return await prismaClient.user.findUnique({
      where: {
        nickname,
      },
    });
  }

  async create(data: CreateUserRequestDto) {
    return await prismaClient.user.create({
      data,
    });
  }
}
