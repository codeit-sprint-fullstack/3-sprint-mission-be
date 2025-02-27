import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // JWT 토큰이 없는 경우에도 요청을 허용
    return user || null;
  }
}
