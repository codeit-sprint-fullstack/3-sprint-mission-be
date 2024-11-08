const express = require('express');
const cors = require('cors'); // cors 불러오기
const productRoutes = require('./routes/productRoutes');
const mongoose = require('mongoose');
const { DATABASE_URL } = require('./env'); 


const app = express();

// JSON 형식의 요청 데이터를 파싱하는 미들웨어 설정
app.use(cors());
app.use(express.json());

// MongoDB 연결 설정
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// 상품 관련 라우트 설정
app.use('/api/products', productRoutes);

module.exports = app;
