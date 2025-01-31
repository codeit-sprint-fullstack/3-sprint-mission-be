import { prismaClient } from '../prismaClient';
import { SignUpRequest } from '../structs/AuthStruct';

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

  async findById(userId: number) {
    return await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        nickname: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        encryptedPassword: false,
      },
    });
  }

  async create(data: SignUpRequest) {
    return await prismaClient.user.create({
      data,
    });
  }
}
