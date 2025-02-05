import { Request, Response } from 'express';
import { CommentService } from './service';

export class CommentController {
  constructor(private commentService: CommentService) {}

  editComment = async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.commentId);
    const { content } = req.body;
    const { userId } = req.user!;

    const comment = await this.commentService.editComment(commentId, userId, { content });
    return res.status(201).json(comment.toJSON());
  };

  deleteComment = async (req: Request, res: Response) => {
    const commentId = parseInt(req.params.commentId);
    const { userId } = req.user!;

    this.commentService.deleteComment(commentId, userId);
    res.sendStatus(204);
  };
}
