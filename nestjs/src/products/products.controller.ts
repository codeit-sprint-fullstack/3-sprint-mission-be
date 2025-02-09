import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AllProductsResponse, ProductsService } from './products.service';
import { ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PassportJwtAuthGuard } from 'src/auth/guards/passport-jwt.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { OptionalAuthGuard } from 'src/auth/guards/passport-optional-jwt.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: '상품 등록' })
  createProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() request: { user?: { userId: string } },
  ) {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    const ownerId = request.user.userId;
    return this.productsService.createProduct(createProductDto, ownerId);
  }

  @Get()
  @ApiOperation({ summary: '상품 목록 조회' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: '페이지 당 상품 수',
    example: 10,
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    type: String,
    description: '정렬 기준',
    enum: ['favorite', 'recent'],
    example: 'recent',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: '검색 키워드',
  })
  getAllProducts(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
    @Query('orderBy') orderBy: string = 'recent',
    @Query('keyword') keyword: string = '',
  ): Promise<AllProductsResponse> {
    return this.productsService.getAllProducts(
      page,
      pageSize,
      orderBy,
      keyword,
    );
  }

  // 상품 상세 조회
  // 로그인하지 않는 경우 좋아요 false 처리 + 조회가능
  // 로그인한 경우 좋아요 여부 조회(유저 정보)
  @Get(':productId')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: '상품 상세 조회' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  getProduct(
    @Param('productId') productId: string,
    @Request() request: { user?: { userId: string } },
  ) {
    const userId = request.user ? request.user.userId : null; // 로그인하지 않는 경우 좋아요 false 처리
    return this.productsService.getProduct(productId, userId);
  }

  // 상품 정보 수정
  @Patch(':productId')
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: '상품 정보 수정' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  updateProduct(
    @Param('productId') productId: string,
    @Request() request: { user?: { userId: string } },
    @Body() updateProductDto: CreateProductDto,
  ) {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    const ownerId = request.user.userId;
    return this.productsService.updateProduct(
      updateProductDto,
      productId,
      ownerId,
    );
  }

  // 상품 삭제
  @Delete(':productId')
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: '상품 삭제' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  deleteProduct(
    @Param('productId') productId: string,
    @Request() request: { user?: { userId: string } },
  ) {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    const ownerId = request.user.userId;
    return this.productsService.deleteProduct(productId, ownerId);
  }

  // 상품 좋아요
  @Post(':productId/favorite')
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: '상품 좋아요' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  addFavorite(
    @Param('productId') productId: string,
    @Request() request: { user?: { userId: string } },
  ) {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    const userId = request.user.userId;
    return this.productsService.addFavorite(productId, userId);
  }

  // 상품 좋아요 취소
  @Delete(':productId/favorite')
  @UseGuards(PassportJwtAuthGuard)
  @ApiOperation({ summary: '상품 좋아요 취소' })
  @ApiParam({ name: 'productId', required: true, description: '상품 ID' })
  removeFavorite(
    @Param('productId') productId: string,
    @Request() request: { user?: { userId: string } },
  ) {
    if (!request.user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    const userId = request.user.userId;
    return this.productsService.removeFavorite(productId, userId);
  }
}
