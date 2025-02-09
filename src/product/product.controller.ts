import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query('sort') sort: 'latest' | 'like' = 'latest',
    @Query('search') search?: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    return this.productService.getAllProducts(
      sort,
      search,
      Number(page),
      Number(pageSize),
    );
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }
    return product;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createProduct(@Req() req, @Body() body) {
    const userId = req.user.userId;
    return this.productService.createProduct(userId, body);
  }
}
