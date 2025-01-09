import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import { editComment, deleteComment } from './Service';
import { createAuthMiddleware } from '../../middleware/auth';
import { AUTH_MESSAGES } from '../../constants/authMessages';

const router = express.Router();

router.patch(
  '/:commentId',
  createAuthMiddleware(AUTH_MESSAGES.update),
  asyncRequestHandler(editComment),
);
router.delete(
  '/:commentId',
  createAuthMiddleware(AUTH_MESSAGES.delete),
  asyncRequestHandler(deleteComment),
);

export default router;
