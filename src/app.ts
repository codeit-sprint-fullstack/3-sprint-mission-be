import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routes/Products/routes';
import articleRouter from './routes/Articles/routes';
import commentRouter from './routes/Comments/routes';
import authRouter from './routes/auth/routes';
import userRouter from './routes/user/routes';
import imageRouter from './routes/Upload/routes';
import swaggerUi from 'swagger-ui-express';
import { specs } from './core/docs/swagger';
import path from 'path';
import cookieParser from 'cookie-parser';

dotenv.config();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [process.env.DEPLOYED_URL, process.env.LOCALHOST].filter(
  Boolean,
) as string[];

const app = express();
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>hello world!</h1>');
});
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
