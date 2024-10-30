import express, { RequestHandler } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

const handler: RequestHandler = (req, res, next) => {
  res.send();
};

app.get('/', handler);

app.listen(PORT, () => {
  console.log('Server is running on port 8000');
});
