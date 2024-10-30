import { Request, Response } from 'express';
import Product from '../../models/product.ts';

export const postProduct = async (req: Request, res: Response) => {
  const { name, description, price, tags, images } = req.body;
  const newProduct = await Product.create({
    name,
    description,
    price,
    tags,
    images,
  });
  return res.status(201).json(newProduct);
};
