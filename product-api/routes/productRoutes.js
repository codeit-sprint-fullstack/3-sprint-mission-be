const express = require('express');
const Product = require('../models/product');
const router = express.Router();

// 1. 상품 등록 API
router.post('/', async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const newProduct = new Product({ name, description, price, tags });
    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// 2. 상품 상세 조회 API
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, 'id name description price tags createdAt');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error });
  }
});

// 3. 상품 수정 API
router.patch('/:id', async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, tags },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// 4. 상품 삭제 API
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// 5. 상품 목록 조회 API (페이지네이션, 검색 및 정렬 포함)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'recent', search = '' } = req.query;
    const offset = (page - 1) * limit;

    // 검색 조건 생성
    const searchCondition = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    };

    // 정렬 조건 설정
    const sortCondition = sort === 'recent' ? { createdAt: -1 } : {};

    // 데이터베이스에서 상품 목록 조회
    const products = await Product.find(searchCondition, 'id name price createdAt')
      .sort(sortCondition)
      .skip(offset)
      .limit(parseInt(limit));

    // 전체 문서 수를 계산하여 페이지네이션 정보를 반환
    const total = await Product.countDocuments(searchCondition);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      currentPage: parseInt(page),
      totalPages,
      totalItems: total,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error });
  }
});

module.exports = router;
