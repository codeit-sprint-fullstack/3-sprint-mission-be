/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

export interface ProductResponse {
  createdAt: Date;
  favoriteCount: number;
  ownerNickname: string;
  ownerId: string;
  images: string[];
  tags: string[];
  price: number;
  description: string;
  name: string;
  id: string;
}

export interface AllProductsResponse {
  totalCount: number;
  list: ProductResponse[];
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // 상품 등록
  async createProduct(createProductDto: CreateProductDto, ownerId: string) {
    const { images, tags, price, description, name } = createProductDto;

    // 상품 등록
    const product = await this.prisma.product.create({
      data: {
        ownerId,
        name,
        description,
        price,
        images: {
          create: images.map((url) => ({ url })),
        },
        productTags: {
          create: tags.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
        images: true,
        productTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return {
      createdAt: product.createdAt,
      favoriteCount: product.favoriteCount,
      ownerNickname: product.owner.nickname,
      ownerId: product.ownerId,
      images: product.images.map((image) => image.url),
      tags: product.productTags.map((productTag) => productTag.tag.name),
      price: product.price,
      description: product.description,
      name: product.name,
      id: product.id,
    };
  }

  // 상품 목록 조회
  async getAllProducts(
    page: number,
    pageSize: number,
    orderBy: string,
    keyword: string,
  ) {
    const skip = (page - 1) * pageSize; // 0
    const orderByField: Prisma.ProductOrderByWithRelationInput =
      orderBy === 'favorite'
        ? { favoriteCount: 'desc' }
        : { createdAt: 'desc' };

    // 검색어가 포함된 상품의 개수와 상품 목록을 조회
    const [totalCount, products] = await Promise.all([
      // 검색어가 포함된 상품의 개수
      this.prisma.product.count({
        where: {
          name: {
            contains: keyword,
          },
        },
      }),
      // 상품 목록 조회
      this.prisma.product.findMany({
        where: {
          name: {
            contains: keyword,
          },
        },
        orderBy: orderByField,
        skip: skip,
        take: pageSize,
        include: {
          owner: {
            select: {
              nickname: true,
            },
          },
          images: true,
          productTags: {
            include: {
              tag: true,
            },
          },
        },
      }),
    ]);

    // 상품 목록이 없을 경우 빈 배열을 반환
    if (!products) {
      return { totalCount: 0, list: [] };
    }

    // 상품 목록을 응답 형식에 맞게 가공
    const list: ProductResponse[] = products.map((product) => ({
      createdAt: product.createdAt,
      favoriteCount: product.favoriteCount,
      ownerNickname: product.owner.nickname,
      ownerId: product.ownerId,
      images: product.images.map((image) => image.url),
      tags: product.productTags.map((productTag) => productTag.tag.name),
      price: product.price,
      description: product.description,
      name: product.name,
      id: product.id,
    }));

    return { totalCount, list };
  }

  // 상품 상세 조회
  async getProduct(productId: string, userId: string | null) {
    // 상품 상세 정보 조회

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
        images: true,
        productTags: {
          include: {
            tag: true,
          },
        },
        // 해당 상품을 좋아요한 사용자 목록 조회
        // 유저가 로그인하지 않은 경우 좋아요 정보를 조회하지 않음
        likes: userId
          ? {
              where: { userId: userId },
            }
          : false,
      },
    });

    // 상품이 없을 경우 에러를 발생시킴
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // 해당 유저가 해당 상품을 좋아요 했는지 확인
    const isLiked = userId ? product.likes.length > 0 : false;

    return {
      createdAt: product.createdAt,
      favoriteCount: product.favoriteCount,
      ownerNickname: product.owner.nickname,
      ownerId: product.ownerId,
      images: product.images.map((image) => image.url),
      tags: product.productTags.map((productTag) => productTag.tag.name),
      price: product.price,
      description: product.description,
      name: product.name,
      id: product.id,
      isFavorite: isLiked, // 해당 유저 정보 필요하네
    };
  }

  // 상품 정보 수정
  async updateProduct(
    updateProductDto: CreateProductDto,
    productId: string,
    ownerId: string,
  ) {
    // 상품 정보 수정
    const { images, tags, price, description, name } = updateProductDto;

    // 상품 조회
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        productTags: true,
      },
    });

    // 상품이 없을 경우 에러 발생
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // 상품 소유자와 로그인한 사용자가 다를 경우 에러 발생
    if (product.ownerId !== ownerId) {
      throw new UnauthorizedException('상품을 수정할 권한이 없습니다.');
    }

    // 이미지 업데이트
    if (images) {
      await this.prisma.image.deleteMany({
        where: { productId: productId },
      });
      await this.prisma.image.createMany({
        data: images.map((url) => ({ url, productId })),
      });
    }

    // 태그 업데이트
    if (tags) {
      await this.prisma.productTag.deleteMany({
        where: { productId: productId },
      });
      const tagIds = await Promise.all(
        tags.map(async (tagName) => {
          const tag = await this.prisma.tag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          return tag.id;
        }),
      );

      await this.prisma.productTag.createMany({
        data: tagIds.map((tagId) => ({
          productId,
          tagId,
        })),
      });
    }

    // 상품 정보 업데이트
    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price,
      },
      include: {
        owner: {
          select: {
            nickname: true,
          },
        },
        images: true,
        productTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return {
      createdAt: updatedProduct.createdAt,
      favoriteCount: updatedProduct.favoriteCount,
      ownerNickname: updatedProduct.owner.nickname,
      ownerId: updatedProduct.ownerId,
      images: updatedProduct.images.map((image) => image.url),
      tags: updatedProduct.productTags.map((productTag) => productTag.tag.name),
      price: updatedProduct.price,
      description: updatedProduct.description,
      name: updatedProduct.name,
      id: updatedProduct.id,
    };
  }

  // 상품 삭제
  async deleteProduct(productId: string, ownerId: string) {
    // 상품 조회
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    // 상품이 없을 경우 에러 발생
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.');
    }

    // 상품 소유자와 로그인한 사용자가 다를 경우 에러 발생
    if (product.ownerId !== ownerId) {
      throw new UnauthorizedException('상품을 삭제할 권한이 없습니다.');
    }

    // 상품 삭제
    await this.prisma.product.delete({
      where: { id: productId },
    });

    return { message: '상품이 삭제되었습니다.' };
  }

  // 좋아요 추가
  async addFavorite(productId: string, userId: string) {
    // 이미 좋아요를 추가했는지 확인
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingLike) {
      throw new ConflictException('이미 좋아요를 추가한 상태입니다.');
    }

    await this.prisma.like.create({
      data: {
        productId,
        userId,
      },
    });

    return { message: '상품에 좋아요를 추가했습니다.' };
  }

  // 좋아요 취소
  async removeFavorite(productId: string, userId: string) {
    // 좋아요가 추가된 상태인지 확인
    const existingLike = await this.prisma.like.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (!existingLike) {
      throw new NotFoundException('좋아요가 추가되지 않은 상태입니다.');
    }

    // 좋아요 취소
    await this.prisma.like.deleteMany({
      where: {
        productId,
        userId,
      },
    });

    return { message: '상품에 좋아요를 취소했습니다.' };
  }

  // 상품 댓글 작성
  async createComment(productId: string, userId: string, content: string) {
    // 상품 조회
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    // 상품이 없을 경우 에러 발생
    if (!product) {
      throw new NotFoundException('상품을 찾을 수 없습니다.(상품 댓글 작성)');
    }

    // 댓글 작성
    const comment = await this.prisma.comment.create({
      data: {
        userId,
        productId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profile_image: true,
          },
        },
      },
    });

    return {
      writer: {
        image: comment.user.profile_image,
        nickname: comment.user.nickname,
        id: comment.user.id,
      },
      updatedAt: comment.updatedAt.toISOString(),
      createdAt: comment.createdAt.toISOString(),
      content: comment.content,
      id: comment.id,
    };
  }

  async getComments(productId: string, limit: string, cursor?: string) {
    // 페이지당 가져올 개수 (cursor 기반 페이징을 위해 limit +1 개수 조회)
    const fetchLimit = Number(limit);
    // 해당 상품에 대한 모든 댓글을 최신순으로 조회(cursor로 페이징)
    const comments = await this.prisma.comment.findMany({
      where: {
        productId,
      },
      orderBy: { createdAt: 'desc' },
      take: fetchLimit + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),

      include: {
        user: {
          select: {
            id: true,
            nickname: true,
            profile_image: true,
          },
        },
      },
    });

    let nextCursor: string | null = null;

    // 가져온 댓글 수가 fetchLimit + 1개인 경우, 다음 페이지 커서를 설정
    if (comments.length > fetchLimit) {
      const nextComment = comments.pop()!;
      nextCursor = nextComment.id;
    }

    const list = comments.map((comment) => ({
      writer: {
        image: comment.user.profile_image,
        nickname: comment.user.nickname,
        id: comment.user.id,
      },
      updatedAt: comment.updatedAt.toISOString(),
      createdAt: comment.createdAt.toISOString(),
      content: comment.content,
      id: comment.id,
    }));

    // 댓글이 없을 경우 빈 배열을 반환
    if (!comments) {
      return [];
    }

    return {
      nextCursor,
      list,
    };
  }
}
