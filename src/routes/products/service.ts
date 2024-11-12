// 비즈니스 로직 공간
import { RequestHandler, Response, Request, NextFunction } from 'express';
import Task from '../../models/Product';

const asyncHandler = (
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      // 어떤 에러인지 분기처리 해보기
      // 에러 핸들링 미들웨어 추가
      console.log(error);
    }
  };
};

// 상품 목록 조회 API
const getProductList = asyncHandler(async (req, res) => {
  const {
    offset = 0,
    limit = 10,
    name,
    description,
    sort = 'recent',
  } = req.query;

  // offset을 어떻게 해야할지 감이 안잡힘
  const searchConditions: Record<string, any> = {};

  if (name) searchConditions.name = { $regex: name as string, $option: 'i' };

  if (description)
    searchConditions.description = {
      $regex: description as string,
      $options: 'i',
    };

  const sortOption: Record<string, 1 | -1> = {
    createdAt: sort === 'recent' ? -1 : 1,
  };

  const products = await Task.find(searchConditions)
    .sort(sortOption) // 최신순으로 정렬
    .skip(Number(offset)) // offset만큼 건너뛰고 검색하기
    .limit(Number(limit));

  res.send(products);
});

// 상품 상세 조회 API
const getProductDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Task.findById(id);
  if (!product) {
    res.status(404).send({ message: '상품을 찾을 수 없습니다.' });
  }
  res.send(product);
});

// 상품 등록 API
const postProduct = asyncHandler(async (req, res) => {
  const { name, description, price, tags } = req.body;
  const newProduct = await Task.create({ name, description, price, tags });
  res.status(201).send(newProduct);
});

// 상품 수정 API
const patchProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Task.findByIdAndUpdate(id, req.body);

  if (!product) {
    res.status(404).send({ message: '상품을 찾을 수 없습니다' });
    return;
  }
  res.send(product);
});

// 상품 삭제 API

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleteTask = await Task.findByIdAndDelete(id);
  if (!deleteTask) {
    const error = new Error('상품을 찾을 수 없습니다.');
    error.name = 'NotFoundError'; // 특정 에러명 설정
    throw error; // 에러를 발생시켜 asyncHandler가 잡게 함
  }
  res.send({ message: '상품 삭제 성공' });
});

const service = {
  getProductList,
  postProduct,
  getProductDetail,
  patchProduct,
  deleteProduct,
};

export default service;
