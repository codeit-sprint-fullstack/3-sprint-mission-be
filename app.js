import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import articleRouter from "./routes/articleRouter.js";
import productRouter from "./routes/productRouter.js";
import commentRouter from "./routes/commentRouter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/article", articleRouter);
app.use("/product", productRouter);
app.use("/comment", commentRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
