import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 사용자 정보 조회
  async getMe(userId: string) {
    // 사용자 정보 조회
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // 사용자 정보가 없을 경우
    if (!user) {
      throw new NotFoundException('사용자 정보가 없습니다.');
    }

    return {
      id: user.id,
      nickname: user.nickname,
      image: user.profile_image,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }

  // 사용자 이미지 업데이트
  async updateProfileImage(userId: string, image: string) {
    // 사용자 정보 업데이트
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { profile_image: image },
    });

    return {
      id: user.id,
      nickname: user.nickname,
      image: user.profile_image,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
}
