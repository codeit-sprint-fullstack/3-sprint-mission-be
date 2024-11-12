import express from 'express';
import service from './service';

const router = express.Router();

router.get('/:id', service.getArticle); // 게시글 조회
router.get('/', service.getArticleList); // 게시글 목록 조회
router.post('/', service.createArticle); // 게시글 등록
router.patch('/:id', service.updateArticle); // 게시글 수정
router.delete('/:id', service.deleteArticle); // 게시글 삭제

router.get('/:id/comment', service.getArticleCommentList); // 자유게시글 댓글 목록 조회
router.post('/:id/comment', service.createArticleComment); // 자유게시글 댓글 등록
router.patch('/:id/comment/:commentId', service.updateArticleComment); // 자유게시글 댓글 수정
router.delete('/:id/comment/:commentId', service.deleteArticleComment); // 자유게시글 댓글 삭제

export default router;
