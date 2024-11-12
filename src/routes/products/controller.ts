// service를 정리한 공간

import express from 'express';
import service from './service';

const router = express.Router();

router.get('/', service.getProductList); // 상품 목록 조회
router.get(':id', service.getProductDetail); // 상품 상세 조회

router.post('/', service.postProduct); // 상품 등록

router.patch('/:id', service.patchProduct); // 상품 수정

router.delete('/:id', service.deleteProduct); // 상품 삭제

export default router;
