import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      // validate: {
      //   validator: {
      //     minLength: 10,
      //     maxLength: 100,
      //   },
      //   message: 'Description must contain between 10 and 100 characters.',
      // }
    },
    price: {
      type: Number,
      required: true,
    },
    tags: {
      type: String,
      // required: true,
      // validate: {
      //   validator: {
      //     minLength: 1,
      //     maxLength: 5,
      //   },
      //   message: 'Tags must contain between 1 and 5 characters.',
      // }
    },
    isComplete: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model('Product', ProductSchema);

export default Product;
