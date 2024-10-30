import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
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
      type: Array,
    }
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;
