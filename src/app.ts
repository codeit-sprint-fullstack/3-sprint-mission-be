import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routes/Products/Controller';
import articleRouter from './routes/Articles/Controller';
import commentRouter from './routes/Comments/Controller';
import authRouter from './routes/auth/controller';
import userRouter from './routes/user/Controller';
import imageRouter from './routes/Upload/Controller';
import swaggerUi from 'swagger-ui-express';
import { specs } from './utils/swagger';
import path from 'path';

dotenv.config();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [process.env.DEPLOYED_URL, process.env.LOCALHOST].filter(
  Boolean,
) as string[];

const app = express();
app.use(
  cors({ origin: allowedOrigins, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'] }),
);
app.use(express.json());
app.use('/products', productRouter);
app.use('/articles', articleRouter);
app.use('/comments', commentRouter);
app.use('/auth', authRouter);
app.use('/upload', imageRouter);
app.use('/users', userRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const startServer = () => {
  try {
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
  } catch (e) {
    console.error('Server start error', e);
  }
};

startServer();
