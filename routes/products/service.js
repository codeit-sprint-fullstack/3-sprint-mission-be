import mongoose from 'mongoose';
import { ErrorMessages } from '../../constants/message.js';
import { isValidObjectId, sendError, filteredObj, fieldTypeValidator } from '../../util.js';
import Product from '../../models/Product.js';

/**
 * @params
 * @param {string} name - 상품 이름 (required)
 * @param {string} description - 상품 설명 (required)
 * @param {number} price - 상품 가격 (required)
 * @param {string[]} tags - 상품 태그 (required)
 * @param {string} category - 상품 카테고리 (required, default: '미분류')
 * @param {string} imageUrl - 상품 이미지 URL
 * @param {string} status - 상품 상태(forsale | soldout | hidden)
 * @param {number} like - 상품 좋아요 수
 */

const getProducts = async (req, res) => {
  // 목표 : id, name, price, createdAt 등을 조회할 수 있도록 구현
  // 1. 정렬 기준을 query string으로 받아오기
  // 2. query string이 없을 경우 기본값은 recent
  // 3. query string이 recent일 경우 최신순, old일 경우 오래된 순으로 정렬
  // 4. limit과 offset을 query string으로 받아오기
  // 5. limit과 offset이 없을 경우 기본값은 limit: 10, offset: 0
  // 6. 상품 목록을 조회하여 응답
  // const sort = req.query.sort || 'recent';
  const keyword = req.query.keyword || '';
  // name 또는 description에 keyword가 포함된 상품 조회
  const searchFields = ['name', 'description'];
  // 검색 조건을 정의
  const searchOption = { $regex: keyword, $options: 'i' };
  // 검색 조건이 존재할 경우 검색 조건을 query에 추가
  const query = keyword ? { $or: searchFields.map(field => ({ [field]: searchOption })) } : {};
  // 정렬 기준을 query string으로 받아오기
  const order = req.query.order === 'recent' ? { createdAt: -1 } : { createdAt: 1 };
  // limit과 offset을 query string으로 받아오기, query string을 통해 전달된 값이 숫자가 아닌 경우 기본값으로 설정
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  // 입력된 query string을 console에 출력
  console.log(`[GET] queryObj`, { ...req.query });
  try {
    // 상품 목록을 조회하여 응답
    // 만약 products가 비어 있는 것은 에러(404)가 아니므로 정상(200) 응답으로 보내야 함
    const products = await Product.find(query).sort(order).skip(offset).limit(limit);
    // console.log(`[GET]`, products);
    const filtered = [
      '_id',
      'name',
      'description',
      'price',
      'tag',
      'category',
      'imageUrl',
      'status',
      'like',
      'createdAt',
    ];
    const partials = products.map(product => filteredObj(product, filtered));
    res.send(partials);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, ErrorMessages.ERROR_GET_PRODUCTS);
  }
};

const getProduct = async (req, res) => {
  try {
    // URL 파라미터로 전달된 id를 받아옴
    const { id } = req.params;

    // 구현목표 : id가 유효하지 않은 ObjectId인 경우 이를 처리해야 한다
    // 1. req.params에서 id를 입력받아 isValidObjectId 메서드를 통해 유효한 mongoose ObjectId인지 확인
    // 2. 유효하지 않은 경우 400 에러와 메시지 반환하고 getProduct 함수 종료
    // 3. 유효한 경우 id로 상품 정보를 조회(아래 코드 계속 실행)
    // ⚠️ 주의 : id 유효성 검사하는 함수와 에러 메시지를 보내는 함수를 분리해야 한다
    if (!isValidObjectId(id)) return sendError(res, 400, ErrorMessages.ERROR_INVALID_REQUEST);

    // id로 상품 정보를 조회
    const product = await Product.findById(id);
    // 상품 정보가 없을 경우 404 에러 반환 후 getProduct 함수 종료
    if (!product) return sendError(res, 404, ErrorMessages.ERROR_GET_PRODUCT);

    console.log(`[GET]`, product);

    // product Object 중 filtered에 포함된 key만 추출하여 새로운 Object(partials) 생성
    const filtered = ['_id', 'name', 'description', 'price', 'tags', 'createdAt'];
    const partials = filteredObj(product, filtered);
    // console.log(`[GET] partials`, partials);
    res.send(partials);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, ErrorMessages.ERROR_GET_PRODUCT);
  }
};

const postProduct = async (req, res) => {
  try {
    // 구현목표: 필수 항목(name, description, price, Array(tag))이 누락되었을 경우 400 에러와 함께 누락된 필드 반환
    // 1. req.body에서 필수 항목(name, description, price, tag)과 선택 항목(category, imageUrl, status, like)을 추출
    // 2. 필수 항목 중 하나라도 누락된 경우 400 에러와 함께 누락된 필드 반환
    // 3. 필수 항목의 타입이 올바르지 않은 경우 400 에러와 함께 누락된 필드 반환
    // 4. 선택 항목 중 필드가 존재하지 않는 경우 400 에러와 함께 누락된 필드 반환
    // 5. 필수 항목도, 선택 항목도 아닌 필드가 존재하는 경우 400 에러와 함께 해당 필드 에러 반환
    // 6. 필수 항목이 모두 존재할 경우 Product 모델을 통해 상품 정보를 저장하고 201 상태코드와 함께 상품 정보 반환
    // req.body에서 오는 필드를 필수 항목과 선택 항목으로 나누어서 객체로 저장해야 한다
    const body = req.body;
    console.log(`[POST] req.body`, body);
    // const { category, imageUrl, status, like } = fields;
    const fields = {
      name: {
        type: 'string',
        required: true,
        value: body.name,
      },
      description: {
        type: 'string',
        required: true,
        value: body.description,
      },
      price: {
        type: 'number',
        required: true,
        value: body.price,
      },
      tag: {
        type: 'array',
        required: true,
        value: body.tag,
      },
      category: {
        type: 'string',
        required: false,
        value: body.category,
      },
      imageUrl: {
        type: 'string',
        required: false,
        value: body.imageUrl,
      },
      status: {
        type: 'string',
        required: false,
        value: body.status,
      },
      like: {
        type: 'number',
        required: false,
        value: body.like,
      },
    };
    const keys = Object.keys(body);
    console.log(keys);
    // 필드에 값이 존재하지 않을 경우 400 에러 반환
    if (keys.length === 0) return sendError(res, 400, ErrorMessages.ERROR_EMPTY_PARAMETER);

    // 필수 항목을 필터링하여 requiredFields에 저장
    const requiredFields = Object.entries(fields)
      .filter(([_, field]) => field.required)
      .reduce((acc, [fieldName, field]) => {
        acc[fieldName] = field;
        return acc;
      }, {});
    // 누락된 항목(필수 항목(required: true)인 값 중)을 필터링하여 missingFields에 저장
    const missingFields = Object.entries(fields)
      .filter(([_, field]) => field.required && !field.value)
      .map(([fieldName]) => fieldName);
    // 선택 항목을 필터링하여 optionalFields에 저장
    const optionalFields = Object.entries(fields)
      .filter(([_, field]) => !field.required)
      .reduce((acc, [fieldName, field]) => {
        acc[fieldName] = field;
        return acc;
      }, {});
    // 유효하지 않은(필수, 선택 항목 모두에 존재하지 않는) 항목을 필터링하여 invalidFields에 저장
    const invalidFields = keys.filter(field => !fields[field]);
    // 유효한 항목만 필터링하여 validFields에 저장
    const validFields = keys.filter(field => fields[field]);
    // 필드의 타입이 올바르지 않은 경우 올바르지 않은 항목을 필터링하여 invalidTypeFields에 저장
    const invalidTypeFields = Object.entries(fields)
      .filter(([_, field]) => {
        // null이나 undefined는 타입 검증에서 제외 (이미 invalidFields에서 처리)
        if (field.value === null || field.value === undefined) {
          return false;
        }
        // 값이 존재하는 경우에만 타입 검증
        return !fieldTypeValidator(field.value, field.type);
      })
      .map(([fieldName]) => fieldName);

    // 필수 항목의 총 개수와 선택 항목의 총 개수를 계산
    const requiredTotal = Object.values(fields).filter(field => field.required).length;
    const optionalTotal = Object.values(fields).filter(field => !field.required).length;
    console.log(`[POST] requiredFields`, requiredFields, requiredFields.length);
    console.log(`[POST] missingFields`, missingFields, missingFields.length);
    console.log(`[POST] optionalFields`, optionalFields, optionalFields.length);
    console.log(`[POST] invalidFields`, invalidFields, invalidFields.length);
    console.log(`[POST] invalidTypeFields`, invalidTypeFields, invalidTypeFields.length);
    console.log(`[POST] validFields`, validFields, validFields.length);
    console.log(`[POST] requiredTotal`, requiredTotal, `optoinalTotal`, optionalTotal);

    // 필수 필드 중 하나라도 누락된 경우 400 에러 반환
    if (missingFields.length > 0)
      return sendError(res, 400, `${ErrorMessages.ERROR_NEED_REQUIRED_PARAMETER} (${missingFields.join(', ')})`);
    // 유효하지 않은 필드가 하나 이상 존재하는 경우 400 에러 반환
    if (invalidFields.length > 0)
      return sendError(res, 400, `${ErrorMessages.ERROR_INVALID_PARAMETER} (${invalidFields.join(', ')})`);
    // 필수 필드의 타입이 올바르지 않은 경우 400 에러 반환
    if (invalidTypeFields.length > 0)
      return sendError(res, 400, `${ErrorMessages.ERROR_INVALID_PARAMETER_TYPE} (${invalidTypeFields.join(', ')})`);

    // 위 조건을 모두 통과한 경우 입력된 필드(필수 항목, 선택 항목 모두 포함)를 조합하여 상품 필드를 생성
    const productFields = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value]));
    const product = await Product.create(productFields);
    // 상품 정보가 제대로 생성되지 않은 경우 400 에러 반환
    if (!product) return sendError(res, 400, ErrorMessages.ERROR_POST_PRODUCT);
    console.log(`[POST]`, product);
    // 생성된 상품 정보 중 id, name, description, price, tag, category, imageUrl, status, like, createdAt을 추출하여 반환
    const filtered = [
      '_id',
      'name',
      'description',
      'price',
      'tag',
      'category',
      'imageUrl',
      'status',
      'like',
      'createdAt',
    ];
    // 상품 정보 중 filtered에 포함된 key만 추출하여 새로운 Object(partials) 생성
    const partials = filteredObj(product, filtered);
    // 생성된 상품 정보를 반환
    res.status(201).send(partials);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, ErrorMessages.ERROR_POST_PRODUCT);
  }
};

const patchProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, ErrorMessages.ERROR_INVALID_REQUEST);

    const params = req.body;
    // req.body에 들어온 값을 검증하는 로직을 추가해야 한다
    // 1. req.body에 들어온 값 중 수정 가능한 필드만 추출하여 업데이트
    // 2. 수정 가능한 필드가 없을 경우 400 에러와 메시지 반환하고 patchProduct 함수 종료
    // 3. 수정 가능한 필드가 있을 경우 id로 상품 정보를 조회하여 업데이트
    // 4. 업데이트된 상품 정보를 반환하기
    const updatableFields = ['name', 'description', 'price', 'tag', 'category', 'imageUrl', 'status', 'like'];
    // 수정 가능한 필드만 추출하여 업데이트
    const filteredUpdatable = filteredObj(params, updatableFields);
    // 수정 가능한 필드가 없을 경우 400 에러 반환
    if (Object.keys(filteredUpdatable).length === 0) return sendError(res, 400, ErrorMessages.ERROR_INVALID_REQUEST);
    // new: true 옵션을 통해 업데이트된 상품 정보를 반환
    const product = await Product.findByIdAndUpdate(id, filteredUpdatable, { new: true });
    // 상품 정보가 없을 경우 404 에러 반환 후 patchProduct 함수 종료
    if (!product) return sendError(res, 404, ErrorMessages.ERROR_PATCH_PRODUCT_NOT_FOUND);
    console.log(`[PATCH]`, product);
    // 생성된 상품 정보 중 id, name, description, price, tag, category, imageUrl, status, like, createdAt을 추출하여 반환
    const filtered = [
      '_id',
      'name',
      'description',
      'price',
      'tag',
      'category',
      'imageUrl',
      'status',
      'like',
      'createdAt',
    ];
    // 상품 정보 중 filtered에 포함된 key만 추출하여 새로운 Object(partials) 생성
    const partials = filteredObj(product, filtered);
    // 업데이트된 상품 정보를 반환
    res.send(partials);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, ErrorMessages.ERROR_PATCH_PRODUCT);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return sendError(res, 400, ErrorMessages.ERROR_INVALID_REQUEST);

    const product = await Product.findByIdAndDelete(id);
    if (!product) return sendError(res, 404, `${ErrorMessages.ERROR_DELETE_PRODUCT_NOT_FOUND} (요청ID: ${id})`);
    console.log(`[DELETE]`, product);
    res.status(204).send(product);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, ErrorMessages.ERROR_DELETE_PRODUCT);
  }
};

const service = {
  getProducts,
  getProduct,
  postProduct,
  patchProduct,
  deleteProduct,
};

export default service;
