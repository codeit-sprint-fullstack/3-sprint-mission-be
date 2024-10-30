import mongoose from "mongoose";
import AutoIncrement from "mongoose-sequence";

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  tags: String,
  createdAt : {
    type : Date,
    default : Date.now
  },
  updatedAt : {
    type: Date,
    default: Date.now
  }
},
{
  timestamps: true,
}
);

ProductSchema.plugin(AutoIncrement(mongoose), { inc_field: 'id' });
const ProductModel = mongoose.model('products',ProductSchema);
export default ProductModel;