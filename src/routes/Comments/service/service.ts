import { EditCommentRequest } from '@/structs/commentStruct';
import { EXCEPTION_MESSAGES } from '@/constants/exceptionMessages';
import { Comment } from '@/routes/Comments/model/comment';
import { AUTH_MESSAGES } from '@/constants/authMessages';
import CommentRepository from '@/routes/Comments/repository/commentRepository';
import { NotFoundException } from '@/core/errors/httpException';
import { UnauthorizedException } from '@/core/errors/httpException';

export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  private async getExistingComment(commentId: number) {
    const existingComment = await this.commentRepository.findCommentById(commentId);
    if (!existingComment) throw new NotFoundException(EXCEPTION_MESSAGES.commentNotFound);
    return existingComment;
  }

  private async validateAuth(commentUserId: number, userId: number, message: string) {
    if (commentUserId !== userId) throw new UnauthorizedException(message);
  }

  async editComment(commentId: number, userId: number, editCommentDto: EditCommentRequest) {
    const existingComment = await this.getExistingComment(commentId);
    await this.validateAuth(existingComment.userId, userId, AUTH_MESSAGES.update);

    const comment = await this.commentRepository.editComment(commentId, editCommentDto);
    return new Comment(comment);
  }

  async deleteComment(commentId: number, userId: number) {
    const existingComment = await this.getExistingComment(commentId);
    await this.validateAuth(existingComment.userId, userId, AUTH_MESSAGES.delete);

    await this.commentRepository.deleteComment(commentId);
  }
}
