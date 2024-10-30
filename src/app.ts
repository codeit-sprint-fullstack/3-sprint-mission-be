import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import productRouter from './routes/Products/Controller.ts';

dotenv.config();
const MONGODB_URI = process.env.DATABASE_URI as string;
const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use('/products', productRouter);

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (e) {
    console.error('MongoDB connection error:', e);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
  } catch (e) {
    console.error('Server start error', e);
  }
};

startServer();
