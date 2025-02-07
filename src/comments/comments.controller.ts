import {
  Controller,
  Patch,
  Delete,
  Get,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { UpdateCommentDto } from './dto/update-comment.dto';

interface AuthRequest extends Request {
  user: { userId: number }; // userId 속성이 존재하는 사용자 객체
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateComment(
    @Req() req: AuthRequest, // AuthRequest 타입 적용
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(req.user.userId, parseInt(id, 10), updateCommentDto.content);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteComment(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.commentsService.deleteComment(req.user.userId, parseInt(id, 10));
  }

  @Get()
  async getComments(@Query('limit') limit?: string) {
    return this.commentsService.getComments(limit ? parseInt(limit, 10) : 10);
  }
}
