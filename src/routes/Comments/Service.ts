import { Request, Response } from 'express';
import { create } from 'superstruct';
import { EditCommentStruct } from '../../structs/CommentStruct';
import { prismaClient } from '../../prismaClient';
import { EXCEPTION_MESSAGES } from '../../constants/ExceptionMessages';
import { Comment } from '../../models/comment';

export const editComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { content } = create(req.body, EditCommentStruct);

  const commentEntity = await prismaClient.$transaction(async (t) => {
    const targetCommentEntity = await t.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!targetCommentEntity) return null;

    return await t.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });
  });

  if (!commentEntity) return res.status(404).json({ message: EXCEPTION_MESSAGES.commentNotFound });

  const comment = new Comment(commentEntity);
  const productId = comment.getProductId();
  const articleId = comment.getArticleId();
  const additional = productId ? { productId } : articleId ? { articleId } : {};

  return res.status(200).json({
    id: comment.getId(),
    ...additional,
    content: comment.getContent(),
    createdAt: comment.getCreatedAt(),
  });
};

export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;

  const commentEntity = await prismaClient.$transaction(async (t) => {
    const targetCommentEntity = await t.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!targetCommentEntity) return null;

    return await t.comment.delete({
      where: {
        id: commentId,
      },
    });
  });

  if (!commentEntity) return res.status(404).json({ message: EXCEPTION_MESSAGES.commentNotFound });

  res.sendStatus(204);
};
