import { Request, Response } from 'express';
import { create } from 'superstruct';
import { EditCommentStruct } from '../../structs/CommentStruct';
import { prismaClient } from '../../prismaClient';
import { EXCEPTION_MESSAGES } from '../../constants/ExceptionMessages';
import { Comment } from '../../models/comment';
import { INCLUDE_USER_CLAUSE } from '../../constants/prisma';
import { AUTH_MESSAGES } from '../../constants/authMessages';

export const editComment = async (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  const { content } = create(req.body, EditCommentStruct);
  const { userId } = req.user!;

  const existingComment = await prismaClient.comment.findUnique({
    where: {
      id: commentId,
    },
    include: INCLUDE_USER_CLAUSE,
  });

  if (!existingComment)
    return res.status(404).json({ message: EXCEPTION_MESSAGES.commentNotFound });

  if (existingComment.userId !== userId)
    return res.status(403).json({ message: AUTH_MESSAGES.update });

  const commentEntity = await prismaClient.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content,
    },
    include: INCLUDE_USER_CLAUSE,
  });

  const comment = new Comment(commentEntity);

  return res.status(200).json(comment.toJSON());
};

export const deleteComment = async (req: Request, res: Response) => {
  const commentId = parseInt(req.params.commentId);
  const { userId } = req.user!;

  const commentEntity = await prismaClient.comment.findUnique({
    where: {
      id: commentId,
    },
    include: INCLUDE_USER_CLAUSE,
  });

  if (!commentEntity) return res.status(404).json({ message: EXCEPTION_MESSAGES.commentNotFound });

  if (commentEntity.userId !== userId)
    return res.status(403).json({ message: AUTH_MESSAGES.delete });

  await prismaClient.comment.delete({
    where: {
      id: commentId,
    },
  });

  res.sendStatus(204);
};
