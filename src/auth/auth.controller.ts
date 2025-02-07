import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private prisma: PrismaService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { email, nickname, password } = signupDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await this.authService.hashPassword(password);

    const newUser = await this.prisma.user.create({
      data: { email, nickname, password: hashedPassword },
    });

    return newUser;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const tokens = this.authService.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        image: user.image || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
