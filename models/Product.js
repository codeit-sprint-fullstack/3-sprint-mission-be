import mongoose from 'mongoose';

/**
 * Product Schema
 * @description Product 모델은 상품 정보를 저장하는 스키마입니다.
 * @param {ObjectId} _id - Product ID는 mongoDB atlas 자동 생성
 * @param {String} name - Product 이름
 * @param {String} description - Product 설명
 * @param {Number} price - Product 가격
 * @param {Array<string>} tag - Product 태그
 * @param {String} category - Product 카테고리
 * @ ----  아래는 Optional Value ----
 * @param {String} imageUrl - Product 이미지 URL
 * @param {String} status - Product 상태(forsale | soldout | hidden)
 * @param {Number} like - Product 좋아요 수
 * @param {Date} createdAt - 생성일은 timestamps로 자동 생성
 * @param {Date} updatedAt - 수정일은 timestamps로 자동 생성
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    tag: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      default: '미분류',
    },
    imageUrl: {
      type: String,
      default: `https://placeholderjs.com/220x220&color=_aaa&background=_e7e7e7&text=No+Image`,
    },
    status: {
      type: String,
      default: 'forsale',
    },
    like: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', productSchema);

export default Product;
