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

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  return res.status(200).json(product);
};
