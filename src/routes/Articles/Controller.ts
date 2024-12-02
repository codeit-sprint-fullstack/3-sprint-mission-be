import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import {
  editArticle,
  postArticle,
  getArticle,
  getArticleList,
  deleteArticle,
  getArticleComments,
  postArticleComment,
} from './Service';

const router = express.Router();

router.post('/', asyncRequestHandler(postArticle));
router.patch('/:articleId', asyncRequestHandler(editArticle));
router.get('/', asyncRequestHandler(getArticleList));
router.get('/:articleId', asyncRequestHandler(getArticle));
router.delete('/:articleId', asyncRequestHandler(deleteArticle));
router.get('/:articleId/comments', asyncRequestHandler(getArticleComments));
router.post('/:articleId/comments', asyncRequestHandler(postArticleComment));

export default router;
