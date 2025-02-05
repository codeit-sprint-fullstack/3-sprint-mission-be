import express from 'express';
import asyncRequestHandler from '../../core/handlers/asyncRequestHandler';
import { createAuthMiddleware } from '../../core/middleware/auth';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import { CommentController } from './controller';
import { CommentService } from './service';
import CommentRepository from '../../repositories/commentRepository';
import { validateBody } from '../../core/middleware/validate';
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
