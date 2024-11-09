import mongoose from 'mongoose';
import { IProduct } from '../types/product';

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      minLength: 1,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    tags: {
      type: [String],
    },
    images: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);
const Product = mongoose.model<IProduct>('Products', ProductSchema);

export default Product;
