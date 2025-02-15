import { PrismaClient } from '@prisma/client';
import { EncryptedSignUpRequest } from '../../structs/authStruct';

export default class UserRepository {
  constructor(private prismaClient: PrismaClient) {}

  async findByEmail(email: string) {
    return await this.prismaClient.user.findUnique({
      where: { email },
    });
  }

  async findByNickname(nickname: string) {
    return await this.prismaClient.user.findUnique({
      where: {
        nickname,
      },
    });
  }

  async findById(userId: number) {
    return await this.prismaClient.user.findUnique({
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

  async create(data: EncryptedSignUpRequest) {
    return await this.prismaClient.user.create({
      data,
    });
  }
}
