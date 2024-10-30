import { Document } from 'mongoose';

export interface IProduct extends Document {
  id?: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  images: string[];
}
