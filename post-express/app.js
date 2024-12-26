import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import articlesRouter from './routes/articles.js';
import commentsRouter from './routes/comments.js';
import productsRouter from './routes/products.js';
import articlelikesRouter from './routes/articlesLikes.js';
import productlikesRouter from './routes/proudctLikes.js';
import productPostRouter from './routes/productPost.js';
import authRouter from './routes/auth.js'
import errorHandler from './middleWare/errorHandler.js';


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use('/articles', articlesRouter);
app.use('/comments', commentsRouter);
app.use('/products', productsRouter);
app.use('/articles/:articleId/like', articlelikesRouter);
app.use('/products/:productId/favorite', productlikesRouter);
app.use('/auth', authRouter);
app.use('/images/uploads', express.static('uploads')); // 업로드된 이미지를 정적 파일로 제공 
app.use('/products', productPostRouter);

app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Started :${port}`));
