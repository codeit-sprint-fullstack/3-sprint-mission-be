import express from 'express';
import connect from './schemas/index.js';
import ProductRouter from './routes/products.js';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();  

app.use(cors());
app.use(express.json());
app.use('/products',ProductRouter);

connect();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

