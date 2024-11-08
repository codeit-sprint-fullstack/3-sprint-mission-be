const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId, // MongoDB의 기본 ObjectId를 사용
      auto: true,
    },
    name: {
      type: String,
      required: true, // 필수 값으로 설정
      trim: true, // 양쪽 공백 제거
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true, // 필수 값으로 설정
      min: 0, // 최소값 0으로 설정 (음수 방지)
    },
    tags: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      default: 0, // 기본값 0
      min: 0, // 음수 방지
    },
    isAvailable: {
      type: Boolean,
      default: true, // 기본값 true
    },
  },
  {
    timestamps: true, // 자동으로 createdAt 및 updatedAt 필드를 추가
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

