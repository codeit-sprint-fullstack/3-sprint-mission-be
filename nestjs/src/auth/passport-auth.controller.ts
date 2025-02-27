import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportLocalGuard } from './guards/passport-local.guard';
import { PassportJwtAuthGuard } from './guards/passport-jwt.guard';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth-v2')
export class PassportAuthController {
  constructor(private authService: AuthService) {}

  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // @UseGuards(PassportLocalGuard) // 로그인 요청이 들어오면 PassportLocalGuard 가 실행됨 -> local.strategy.ts 의 validate 함수 실행 -> request.user 에 유저 정보가 담김
  // login(@Request() request) {
  //   return this.authService.signIn(request.user);
  // }

  // @Get('me')
  // @UseGuards(PassportJwtAuthGuard) // me 요청이 들어오면 PassportJwtAuthGuard 가 실행됨 -> jwt.strategy.ts 의 validate 함수 실행 -> request.user 에 유저 정보가 담김
  // getUserInfo(@Request() request) {
  //   return request.user;
  // }
}
