import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async updateComment(userId: number, commentId: number, content: string) {
    const comment = await this.prisma.productComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    return this.prisma.productComment.update({
      where: { id: commentId },
      data: { content },
    });
  }

  async deleteComment(userId: number, commentId: number) {
    const comment = await this.prisma.productComment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    await this.prisma.productComment.delete({
      where: { id: commentId },
    });

    return { message: '삭제되었습니다.' };
  }

  async getComments(limit: number = 10) {
    return this.prisma.productComment.findMany({
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }
}
