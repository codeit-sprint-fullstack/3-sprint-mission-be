import express from 'express';
import asyncRequestHandler from '../../utils/asyncRequestHandler';
import { editArticle, postArticle, getArticle, getArticleList, deleteArticle } from './Service';

const router = express.Router();

router.post('/', asyncRequestHandler(postArticle));
router.patch('/:id', asyncRequestHandler(editArticle));
router.get('/', asyncRequestHandler(getArticleList));
router.get('/:id', asyncRequestHandler(getArticle));
router.delete('/:id', asyncRequestHandler(deleteArticle));

export default router;
