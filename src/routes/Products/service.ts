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

export const editProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, tags, images } = req.body;
  const product = await Product.findById(id);
  if (product) {
    product.name = name;
    product.description = description;
    product.price = price;
    product.tags = tags;
    product.images = images;
    await product?.save();
    return res.status(201).json(product);
  }
  return res.status(404);
};
