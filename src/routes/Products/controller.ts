import { Request, Response } from 'express';
import { ProductService } from './service';
import { parseId } from '@/utils/parseId';

export class ProductController {
  constructor(private productService: ProductService) {}

  postProduct = async (req: Request, res: Response) => {
    const createProductDto = req.body;
    const userId = req.user?.userId!;

    const product = await this.productService.postProduct(userId, createProductDto);
    return res.status(201).json(product.toJSON());
  };

  getProduct = async (req: Request, res: Response) => {
    const productId = parseId(req.params.productId);
    const userId = req.user?.userId!;
    const productEntity = await this.productService.getProductById(productId, userId);

    return res.status(200).json(productEntity.toJSON());
  };

  editProduct = async (req: Request, res: Response) => {
    const productId = parseId(req.params.productId);
    const userId = req.user?.userId!;
    const editProductRequestDto = req.body;

    const productEntity = await this.productService.editProduct(
      productId,
      userId,
      editProductRequestDto,
    );

    return res.status(201).json(productEntity.toJSON());
  };

  deleteProduct = async (req: Request, res: Response) => {
    const productId = parseId(req.params.productId);
    const userId = req.user?.userId!;

    await this.productService.deleteProduct(productId, userId);

    res.status(204);
  };

  getProducts = async (req: Request, res: Response) => {
    const getProductsDto = req.validatedQuery;

    const result = await this.productService.getProductList(getProductsDto);

    return res.status(200).json({
      ...result,
      list: result.list.map((product) => product.toJSON()),
    });
  };

  postProductComment = async (req: Request, res: Response) => {
    const productId = parseId(req.params.productId);
    const userId = req.user?.userId!;
    const postProductCommentDto = req.body;

    const commentEntity = await this.productService.postProductComment(
      productId,
      userId,
      postProductCommentDto,
    );

    return res.status(201).json(commentEntity.toJSON());
  };

  getProductComments = async (req: Request, res: Response) => {
    const productId = parseId(req.params.productId);
    const userId = req.user?.userId!;
    const getProductCommentsDto = req.validatedQuery!;

    const result = await this.productService.getProductComments(
      productId,
      userId,
      getProductCommentsDto,
    );
    const comments = result.comments.map((comment) => comment.toJSON());

    return res.status(200).json({
      ...result,
      list: comments,
    });
  };

  setFavorite = async (req: Request, res: Response) => {
    const productId = parseId(req.params.productId);
    const userId = req.user?.userId!;

    const productEntity = await this.productService.setFavorite(productId, userId);

    return res.status(201).json(productEntity.toJSON());
  };

  deleteFavorite = async (req: Request, res: Response) => {
    const productId = parseId(req.params.productId);
    const userId = req.user?.userId!;

    const productEntity = await this.productService.deleteFavorite(productId, userId);

    return res.status(201).json(productEntity.toJSON());
  };
}
