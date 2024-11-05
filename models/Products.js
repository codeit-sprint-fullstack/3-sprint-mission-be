import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  tags: [String], // Mongoose에서 배열의 타입 지정 시, 배열 안에 포함된 요소의 타입만 명시
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema); //products

export default Product;