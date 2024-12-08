import * as dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";
import router from "./router/index.js";
import cors from "cors";

dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
//라우터 기본 세팅
app.use("/api", router);

//예시
// app.get("/good", (req, res) => {
//   res.send("hi-");
// });

// //게시글 조회 API
// app.get("/article/:id", async (req, res) => {
//   const { id } = req.params;
//   console.log(id);
//   /* id랑 같은거 user에 담는다. */
//   const user = await prisma.article.findUnique({
//     where: {
//       id,
//     },
//   });
// });

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Started :${port}`));
