import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductCommentService } from './productComment.service';

@Controller('productComment')
export class ProductCommentController {
  constructor(private productCommentService: ProductCommentService) {}

  @Get(':productId')
  async getComments(@Param('productId') productId: string) {
    return this.productCommentService.getCommentsByProductId(productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createComment(@Req() req, @Body() body) {
    console.log('req.user:', req.user);

    if (!req.user || !req.user.userId) {
      throw new Error('유저 정보가 없습니다. 로그인 상태를 확인하세요.');
    }

    const { productId, content } = body;
    return this.productCommentService.createComment(
      req.user.userId,
      productId,
      content,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':commentId')
  async deleteComment(@Req() req, @Param('commentId') commentId: string) {
    const userId = req.user.userId;
    return this.productCommentService.deleteComment(userId, commentId);
  }
}
