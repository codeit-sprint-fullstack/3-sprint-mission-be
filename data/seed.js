import mongoose from 'mongoose';
import mockData from './mock.js';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일에서 환경 변수 로드

// MongoDB 연결
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결됨');

    // 기존 데이터 제거 (중복 방지)
    await Product.deleteMany({});
    console.log('기존 데이터 삭제 완료');

    // 목업 데이터 삽입
    await Product.insertMany(mockData);
    console.log('목업 데이터 삽입 완료');

    mongoose.connection.close();  // 연결 종료
    console.log('MongoDB 연결 종료');
  } catch (error) {
    console.error('데이터베이스 시드 에러:', error);
  }
};

seedDatabase();