import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { PRODUCTS } from './mock.js';

dotenv.config();
mongoose.connect(process.env.DATABASE_URL);

await Product.deleteMany({});
await Product.insertMany(PRODUCTS);

console.log(`🌱 Seed 데이터가 성공적으로 추가되었습니다.`);

mongoose.connection.close();
