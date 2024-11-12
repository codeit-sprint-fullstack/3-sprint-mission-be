import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    tags: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Task', ProductSchema);

export default Product;
