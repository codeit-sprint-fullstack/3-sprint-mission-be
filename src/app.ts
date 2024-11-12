import express from 'express';
import mongoose from 'mongoose';
import { MONGO_URI, PORT } from './env';
import cors from 'cors';
import router from './routes/index';

const app = express();

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', router);

app.listen(PORT, () => console.log('서버 시작' + '포트' + PORT));
