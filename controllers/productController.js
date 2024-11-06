import Product from '../models/Product.js';

// 전체 제품 조회
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: '제품 데이터를 불러오는 중 오류가 발생했습니다.' });
  }
};

// 특정 ID로 제품 조회
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: '제품을 찾을 수 없습니다.' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: '제품 조회 중 오류가 발생했습니다.' });
  }
};

// 새 제품 추가
export const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: '제품 생성 중 오류가 발생했습니다.' });
  }
};

// 특정 ID의 제품 수정
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ error: '제품을 찾을 수 없습니다.' });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: '제품 수정 중 오류가 발생했습니다.' });
  }
};

// 특정 ID의 제품 삭제
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: '제품을 찾을 수 없습니다.' });
    res.status(200).json({ message: '제품이 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '제품 삭제 중 오류가 발생했습니다.' });
  }
};
