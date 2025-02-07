import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

// 🔹 req.user를 올바르게 인식하도록 인터페이스 정의
interface AuthRequest extends Request {
  user: { userId: number };
}

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productService.getProductById(parseInt(id, 10));
  }

  @Get()
  async getProducts(
    @Query('searchKeyword') searchKeyword?: string,
    @Query('offset') offset?: string,
    @Query('limit') limit?: string
  ) {
    return this.productService.getProducts(
      searchKeyword,
      parseInt(offset ?? '0', 10), // 🔹 undefined 방지
      parseInt(limit ?? '10', 10)   // 🔹 undefined 방지
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
  }))
  async createProduct(
    @Req() req: AuthRequest, // 🔹 AuthRequest 사용
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return this.productService.createProduct(req.user.userId, createProductDto, file?.filename);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateProduct(
    @Req() req: AuthRequest, // 🔹 AuthRequest 사용
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.productService.updateProduct(req.user.userId, parseInt(id, 10), updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Req() req: AuthRequest, // 🔹 AuthRequest 사용
    @Param('id') id: string
  ) {
    return this.productService.deleteProduct(req.user.userId, parseInt(id, 10));
  }

  @Post(':productId/like')
  @UseGuards(AuthGuard)
  async likeProduct(
    @Req() req: AuthRequest, // 🔹 AuthRequest 사용
    @Param('productId') productId: string
  ) {
    return this.productService.likeProduct(req.user.userId, parseInt(productId, 10));
  }

  @Delete(':productId/like')
  @UseGuards(AuthGuard)
  async unlikeProduct(
    @Req() req: AuthRequest, // 🔹 AuthRequest 사용
    @Param('productId') productId: string
  ) {
    return this.productService.unlikeProduct(req.user.userId, parseInt(productId, 10));
  }

  @Get('/comments')
  async getComments(@Query('limit') limit?: string) {
    return this.productService.getComments(parseInt(limit ?? '10', 10)); // 🔹 undefined 방지
  }
}
