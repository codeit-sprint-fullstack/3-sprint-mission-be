import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
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
      throw new Error('댓글이 존재하지 않습니다.');
    }

    // 해당 댓글의 작성자랑 맞는지 확인
    if (comment.user.id !== userId) {
      throw new Error('댓글 작성자만 수정할 수 있습니다.');
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
}
