import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import { createAuthMiddleware } from '../../middleware/auth';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import { CommentController } from './controller';
import { CommentService } from './service';
import CommentRepository from '../../repositories/commentRepository';
import { validateBody } from '../../middleware/validateMiddleware';
import { EditCommentStruct } from '../../structs/commentStruct';

const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);
const commentController = new CommentController(commentService);
const router = express.Router();

router.patch(
  '/:commentId',
  validateBody(EditCommentStruct),
  createAuthMiddleware(AUTH_MESSAGES.update),
  asyncRequestHandler(commentController.editComment),
);
router.delete(
  '/:commentId',
  createAuthMiddleware(AUTH_MESSAGES.delete),
  asyncRequestHandler(commentController.deleteComment),
);

export default router;
