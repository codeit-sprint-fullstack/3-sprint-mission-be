/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // 유저 정보 가져오기
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // 유저 정보가 없으면 에러 발생
    if (!user) {
      throw new UnauthorizedException();
    }

    // 입력한 비밀번호와 저장된 비밀번호 비교
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    console.log('user', user);
    // 유저 정보 반환
    return user;
  }
}
