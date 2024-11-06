import mongoose from 'mongoose';
import { MONGO_URI } from '../env';

mongoose.connect(MONGO_URI);
console.log('success');
mongoose.connection.close();
