import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRouter from './routes/Products/Controller';

dotenv.config();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [process.env.DEPLOYED_URL, process.env.LOCALHOST].filter(
  Boolean,
) as string[];

const app = express();
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use('/products', productRouter);

const startServer = () => {
  try {
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
  } catch (e) {
    console.error('Server start error', e);
  }
};

startServer();
