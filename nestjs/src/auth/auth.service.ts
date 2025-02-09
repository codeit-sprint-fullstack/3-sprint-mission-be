import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    nickname: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // 회원가입
  async createUser(createAuthDto: CreateAuthDto) {
    // 이메일 중복이 없는지 확인
    const emailExists = await this.prisma.user.findUnique({
      where: { email: createAuthDto.email }, // 이메일이 이미 존재하는지 확인
    });
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    // 닉네임 중복이 없는지 확인
    const nicknameExists = await this.prisma.user.findUnique({
      where: { nickname: createAuthDto.nickname }, // 닉네임이 이미 존재하는지 확인
    });
    if (nicknameExists) {
      throw new ConflictException('Nickname already exists');
    }

    // 비밀번호 암호화
    const saltRounds = 10;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const hashedPassword = (await bcrypt.hash(
      createAuthDto.password,
      saltRounds,
    )) as string;

    // 사용자 생성
    const user = await this.prisma.user.create({
      data: {
        email: createAuthDto.email,
        nickname: createAuthDto.nickname,
        password: hashedPassword,
      },
    });

    // accessToken, refreshToken 생성
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      nickname: user.nickname,
    };
    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: '7d',
    });

    // 사용자 정보 반환
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: null,
      },
    };
  }

  // 로그인
  async signIn(user: User): Promise<AuthResult> {
    const tokenPayload = {
      sub: user.id,
      username: user.nickname,
    };

    const accessToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  // 리프레시 토큰을 받아서 새로운 액세스 토큰을 발급
  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(
        refreshToken,
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, email: user.email, nickname: user.nickname },
        { expiresIn: '1h' },
      );

      return { accessToken: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
