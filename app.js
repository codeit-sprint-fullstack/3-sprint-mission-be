import express from "express";
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();

const port = 8000;
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);

app.listen(port, () => console.log(`${port}서버시작`));
