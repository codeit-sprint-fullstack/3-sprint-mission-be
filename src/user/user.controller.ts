import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body() data: { email: string; password: string; nickname: string },
  ) {
    return this.userService.createUser(
      data.email,
      data.password,
      data.nickname,
    );
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    return this.userService.getUserById(userId);
  }
}
