import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
app.use(express.json());
app.use(cors({origin: "*", credentials: true}));

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// Express 앱 초기화
const app = express();
app.use(bodyParser.json());

// 파일 저장 경로 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// Multer 미들웨어 초기화
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다.'));
    }
  }
});

// 유효성 검증 미들웨어
const validateProduct = (req, res, next) => {
  const { name, description, price } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: '상품 이름은 필수이며 문자열이어야 합니다.' });
  }
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ error: '상품 설명은 문자열이어야 합니다.' });
  }
  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ error: '가격은 양수이어야 합니다.' });
  }
  next();
};

// 상품 등록 API
app.post('/products', upload.single('image'), validateProduct, (req, res) => {
  const { name, description, price } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const product = {
    id: Date.now(), // 간단한 ID 생성
    name,
    description,
    price,
    imagePath,
  };

  // 예시: 응답 객체
  res.status(201).json({
    message: '상품이 성공적으로 등록되었습니다.',
    product,
  });
});

// 에러 핸들링
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Multer 에러: ${err.message}` });
  }
  res.status(500).json({ error: err.message });
});

// 서버 시작
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
