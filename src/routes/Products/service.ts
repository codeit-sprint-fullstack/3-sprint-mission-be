import { Request, Response } from 'express';
import Product from '../../models/product.ts';
import { PRODUCT_RESPONSE_MESSAGE } from '../../constants/messages.ts';
import { QUERY_OPTIONS } from '../../constants/queryOptions.ts';

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
    await product.save();
    return res.status(201).json(product);
  }
  return res.status(404).json({ message: PRODUCT_RESPONSE_MESSAGE.cannotFindProduct });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    return res.status(404).json({ message: PRODUCT_RESPONSE_MESSAGE.cannotFindProduct });
  }

  return res.status(200).json({ message: PRODUCT_RESPONSE_MESSAGE.productDeleted });
};

export const getProductList = async (req: Request, res: Response) => {
  const {
    id,
    name,
    price,
    description,
    createdAt,
    page = 1,
    pageSize = 100,
    sort = QUERY_OPTIONS.defaultSort,
    order = QUERY_OPTIONS.order.desc,
  } = req.query;
  const skip = (Number(page) - 1) * Number(pageSize);

  const products = await Product.find({
    ...(id && { id }),
    ...(name && { name: { $regex: name, $options: 'i' } }),
    ...(price && { price }),
    ...(description && { description: { $regex: description, $options: 'i' } }),
    ...(createdAt && { createdAt }),
  })
    .sort({ [sort as string]: order === QUERY_OPTIONS.order.asc ? 1 : -1 })
    .skip(skip)
    .limit(Number(pageSize));

  if (products) return res.status(200).json(products);
};
