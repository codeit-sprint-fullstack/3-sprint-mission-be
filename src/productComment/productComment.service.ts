import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductCommentService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommentsByProductId(productId: string) {
    return this.prisma.productComment.findMany({
      where: { productId },
      include: {
        user: { select: { id: true, nickname: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createComment(userId: string, productId: string, content: string) {
    return this.prisma.productComment.create({
      data: {
        userId,
        productId,
        content,
      },
    });
  }

  async deleteComment(userId: string, commentId: string) {
    const comment = await this.prisma.productComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('삭제할 댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('본인이 작성한 댓글만 삭제할 수 있습니다.');
    }

    await this.prisma.productComment.delete({
      where: { id: commentId },
    });

    return { message: '댓글이 삭제되었습니다.' };
  }
}
