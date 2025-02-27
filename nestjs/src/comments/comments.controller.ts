import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiOperation } from '@nestjs/swagger';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // 댓글 수정
  @Patch(':commentId')
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: '댓글 수정' })
  updateComment(
    @Param('commentId') commentId: string,
    @Request() request: { user?: { userId: string } },
    @Body() { content }: { content: string },
  ) {
    if (!request.user) {
      throw new UnauthorizedException(
        '상품 수정하기 위해 로그인이 필요합니다.',
      );
    }
    const userId = request.user.userId;
    return this.commentsService.updateComment(commentId, userId, content);
  }

  // 댓글 삭제
  @Delete(':commentId')
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: '댓글 삭제' })
  deleteComment(
    @Param('commentId') commentId: string,
    @Request() request: { user?: { userId: string } },
  ) {
    if (!request.user) {
      throw new UnauthorizedException(
        '상품 삭제하기 위해 로그인이 필요합니다.',
      );
    }
    const userId = request.user.userId;
    return this.commentsService.deleteComment(commentId, userId);
  }
}
