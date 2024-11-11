import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/products.js';

dotenv.config(); // .env 파일에서 환경 변수 로드

const app = express();
const PORT = process.env.PORT || 8000;

// CORS 설정
app.use(cors({ origin: 'http://localhost:3000' }));

// JSON 파싱 미들웨어
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 연결됨'))
  .catch((error) => console.log('MongoDB 연결오류:', error));

// 라우트 연결
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});