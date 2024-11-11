import express from "express";
const router = express.Router();
import Product from '../models/Product.js';

// 1. 상품 목록 조회 API
router.get('/', async (req, res) => {
  // offset, limit, order, keyword 파라미터를 쿼리에서 받아오기
  const { offset = 0, limit = 10, orderBy = 'recent', keyword = '' } = req.query;

  // 검색 조건 설정 (keyword가 있으면 name과 description에 포함된 데이터 검색)
  const searchQuery = keyword
    ? {
      $or: [
        { name: { $regex: keyword, $options: 'i' } }, // 대소문자 구분 없이 검색
        { description: { $regex: keyword, $options: 'i' } },
      ],
    }
    : {};

  try {
    // MongoDB 쿼리 실행
    const products = await Product.find(searchQuery)
      .sort(orderBy === 'recent' ? { createdAt: -1 } : {}) // 최신순 정렬
      .skip(parseInt(offset, 10)) // offset 설정
      .limit(parseInt(limit, 10)) // limit 설정
      .select('id name price createdAt favoriteCount'); // 필요한 필드만 선택

    // 총 상품 수 구하기 (검색 조건 적용)
    const totalCount = await Product.countDocuments(searchQuery);

    // 응답
    res.json({ products, totalCount });
  } catch (error) {
    console.error('상품 목록 조회 중 오류:', error);
    res.status(500).json({ error: '상품 목록을 가져오는 중 오류가 발생했습니다.' });
  }
});


// 2. 상품 상세 조회 API
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select('id name description price tags createdAt');

    if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: '상품 상세 정보를 불러오는 중 오류가 발생했습니다.', error });
  }
});

// 3. 상품 등록 API
router.post('/', async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;

    const newProduct = new Product({ name, description, price, tags });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: '상품을 등록하는 중 오류가 발생했습니다.', error });
  }
});

// 4. 상품 수정 API
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, tags },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });

    res.status(200).json({ message: '상품이 성공적으로 수정되었습니다.', updatedProduct });
  } catch (error) {
    res.status(500).json({ message: '상품을 수정하는 중 오류가 발생했습니다.', error });
  }
});

// 5. 상품 삭제 API
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });

    res.status(200).json({ message: '상품이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '상품을 삭제하는 중 오류가 발생했습니다.', error });
  }
});

export default router;