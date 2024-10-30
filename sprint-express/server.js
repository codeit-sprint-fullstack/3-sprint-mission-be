const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("./middleware/cors");
const productRoutes = require("./routes/products");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(cors);
app.use(express.json()); // JSON 파싱
app.use("/api/products", productRoutes); // API 라우트 설정

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
