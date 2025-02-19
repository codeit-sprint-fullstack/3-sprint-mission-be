import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async updateComment(commentId: string, userId: string, content: string) {
    // 해당 댓글이 존재하는지 확인
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profile_image: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }

    // 해당 댓글의 작성자랑 맞는지 확인
    if (comment.user.id !== userId) {
      throw new ForbiddenException('댓글 작성자만 수정할 수 있습니다.');
    }

    // 댓글 수정
    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });

    console.log('updatedAt', updatedComment.updatedAt);
    console.log(
      'updatedAt.toISOString',
      updatedComment.updatedAt.toISOString(),
    );

    return {
      writer: {
        image: comment.user.profile_image,
        nickname: comment.user.nickname,
        id: comment.user.id,
      },
      updatedAt: updatedComment.updatedAt.toISOString(),
      createdAt: updatedComment.createdAt.toISOString(),
      content: updatedComment.content,
      id: updatedComment.id,
    };
  }

  async deleteComment(commentId: string, userId: string) {
    // 해당 댓글이 존재하는지 확인
    const comment = await this.prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('댓글이 존재하지 않습니다.');
    }

    // 해당 댓글의 작성자랑 맞는지 확인
    if (comment.user.id !== userId) {
      throw new ForbiddenException('댓글 작성자만 삭제할 수 있습니다.');
    }

    // 댓글 삭제
    await this.prisma.comment.delete({
      where: { id: commentId },
    });
    return { message: '댓글이 삭제되었습니다.' };
  }
}
