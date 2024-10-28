import express from 'express';

const app = express();  // Express 애플리케이션 생성
const PORT = 8000;  // 기본 포트 설정

app.use(express.json());

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.send('Hello, ㅇㅅㅇ');
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});