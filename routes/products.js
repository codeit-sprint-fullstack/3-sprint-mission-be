import express from "express";
const router = express.Router();
import Product from '../models/Product.js';

// 1. 상품 목록 조회 API
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', order = 'recent' } = req.query;
    const skip = (page - 1) * limit;
    const sortOption = order === 'recent' ? { createdAt: -1 } : { createdAt: 1 };

    const query = search ? { name: new RegExp(search, 'i') } : {};
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .select('id name price createdAt');

    const totalItems = await Product.countDocuments(query);

    res.status(200).json({
      data: products,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: '상품 목록을 불러오는 중 오류가 발생했습니다.', error });
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