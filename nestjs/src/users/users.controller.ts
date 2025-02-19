import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation } from '@nestjs/swagger';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: '내 정보 조회' })
  @UseGuards(PassportJwtAuthGuard)
  getMe(@Request() request: { user?: { userId: string } }) {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return this.usersService.getMe(request.user.userId);
  }
}
