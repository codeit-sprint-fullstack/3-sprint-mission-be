import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import { editComment, deleteComment } from './Service';

const router = express.Router();

router.patch('/:commentId', asyncRequestHandler(editComment));
router.delete('/:commentId', asyncRequestHandler(deleteComment));

export default router;
