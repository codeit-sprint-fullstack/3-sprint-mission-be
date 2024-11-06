import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);           // 전체 제품 조회
router.get('/:id', getProductById);         // 특정 제품 조회
router.post('/', createProduct);            // 새 제품 추가
router.patch('/:id', updateProduct);        // 특정 제품 수정
router.delete('/:id', deleteProduct);       // 특정 제품 삭제

export default router;
