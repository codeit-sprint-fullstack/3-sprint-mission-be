import express from 'express';
import asyncRequestHandler from '@/core/handlers/asyncRequestHandler';
import { createAuthMiddleware } from '@/core/middleware/auth/auth';
import { AUTH_MESSAGES } from '@/constants/authMessages';
import { CommentController } from './controller/controller';
import { CommentService } from './service/service';
import CommentRepository from './repository/commentRepository';
import { validateBody } from '@/core/middleware/validate';
import { EditCommentStruct } from '@/structs/commentStruct';
import { prismaClient } from '@/prismaClient';

const commentRepository = new CommentRepository(prismaClient);
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
