import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import mainRouter from './routes/index.js';

// .env 파일을 읽어서 process.env에 추가
dotenv.config();

// express 서버 생성
const app = express();
// 포트 설정
const PORT = process.env.PORT || 8000;

// mongoose를 사용하기 위해 연결
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log('🌱 mongoDB에 성공적으로 연결되었습니다.');
  })
  .catch(error => {
    console.log('❌ mongoDB 연결에 실패했습니다.\r\n', error);
  });

// .env 파일에서 ORIGINS를 읽어서 배열로 변환, 없으면 기본값 사용
const allowedOrigins = process.env.ORIGINS.split(',') || [`http://localhost:${PORT}`];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

// CORS 미들웨어 추가
app.use(cors(corsOptions));
// JSON 파싱을 위한 미들웨어 추가
app.use(express.json());

// products 라우터 추가
app.use('/', mainRouter);

app.get('/test', (req, res) => {
  res.send({
    method: req.method,
    status: res.statusCode,
    message: 'API Testing...',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Express 서버가 http://localhost:${PORT}에서 작동 중입니다.`);
});
