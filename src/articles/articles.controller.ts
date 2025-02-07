import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Req,
  Res,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { AuthGuard } from '../auth/auth.guard';

interface AuthRequest extends Request {
  user: { userId: number };
}

@Controller('articles')
export class ArticlesController {
  constructor(private readonly prisma: PrismaService) {}

  // 게시글 단건 조회
  @Get(':id')
  async getArticle(@Param('id') id: string, @Res() res: Response) {
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      throw new HttpException('잘못된 ID 형식입니다.', HttpStatus.BAD_REQUEST);
    }

    const article = await this.prisma.article.findUnique({ where: { id: numId } });

    if (!article) {
      throw new HttpException('게시글을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    res.status(HttpStatus.OK).json(article);
  }

  // 게시글 목록 조회
  @Get()
  async getArticles(@Query('offset') offset = '0', @Query('limit') limit = '5', @Res() res: Response) {
    const articles = await this.prisma.article.findMany({
      skip: parseInt(offset, 10),
      take: parseInt(limit, 10),
    });

    res.status(HttpStatus.OK).json(articles);
  }

  // 게시글 검색
  @Get('search')
  async searchArticles(
    @Query('searchKeyword') searchKeyword: string,
    @Query('offset') offset = '0',
    @Query('limit') limit = '10',
    @Res() res: Response
  ) {
    if (!searchKeyword?.trim()) {
      throw new HttpException('검색어가 비어 있습니다.', HttpStatus.BAD_REQUEST);
    }

    const articles = await this.prisma.article.findMany({
      skip: parseInt(offset, 10),
      take: parseInt(limit, 10),
      where: {
        OR: [
          { title: { contains: searchKeyword, mode: 'insensitive' } },
          { content: { contains: searchKeyword, mode: 'insensitive' } },
        ],
      },
    });

    res.status(HttpStatus.OK).json(articles);
  }

  // 게시글 등록
  @Post()
  @UseGuards(AuthGuard)
  async createArticle(@Req() req: AuthRequest, @Body() body, @Res() res: Response) {
    const { title, content } = body;

    try {
      const newArticle = await this.prisma.article.create({
        data: { title, content, userId: req.user.userId },
      });

      res.status(HttpStatus.CREATED).json(newArticle);
    } catch (error) {
      throw new HttpException('게시글 등록 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 게시글 수정
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateArticle(@Param('id') id: string, @Req() req: AuthRequest, @Body() body, @Res() res: Response) {
    const numId = parseInt(id, 10);
    const { title, content } = body;

    if (isNaN(numId)) {
      throw new HttpException('잘못된 ID 형식입니다.', HttpStatus.BAD_REQUEST);
    }

    try {
      const article = await this.prisma.article.findUnique({ where: { id: numId } });

      if (!article || article.userId !== req.user.userId) {
        throw new HttpException('수정 권한이 없습니다.', HttpStatus.FORBIDDEN);
      }

      const updatedArticle = await this.prisma.article.update({
        where: { id: numId },
        data: { title, content },
      });

      res.status(HttpStatus.OK).json(updatedArticle);
    } catch (error) {
      throw new HttpException('게시글 수정 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 게시글 삭제
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteArticle(@Param('id') id: string, @Req() req: AuthRequest, @Res() res: Response) {
    const numId = parseInt(id, 10);

    if (isNaN(numId)) {
      throw new HttpException('잘못된 ID 형식입니다.', HttpStatus.BAD_REQUEST);
    }

    try {
      const article = await this.prisma.article.findUnique({ where: { id: numId } });

      if (!article || article.userId !== req.user.userId) {
        throw new HttpException('삭제 권한이 없습니다.', HttpStatus.FORBIDDEN);
      }

      await this.prisma.article.delete({ where: { id: numId } });

      res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (error) {
      throw new HttpException('게시글 삭제 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // '좋아요' 추가
  @Post(':articleId/like')
  @UseGuards(AuthGuard)
  async likeArticle(@Param('articleId') articleId: string, @Req() req: AuthRequest, @Res() res: Response) {
    const numArticleId = parseInt(articleId, 10);

    if (isNaN(numArticleId)) {
      throw new HttpException('잘못된 ID 형식입니다.', HttpStatus.BAD_REQUEST);
    }

    try {
      const like = await this.prisma.isLiked.create({
        data: { userId: req.user.userId, articleId: numArticleId },
      });

      res.status(HttpStatus.CREATED).json(like);
    } catch (error) {
      throw new HttpException('좋아요 추가 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // '좋아요' 삭제
  @Delete(':articleId/like')
  @UseGuards(AuthGuard)
  async unlikeArticle(@Param('articleId') articleId: string, @Req() req: AuthRequest, @Res() res: Response) {
    const numArticleId = parseInt(articleId, 10);

    if (isNaN(numArticleId)) {
      throw new HttpException('잘못된 ID 형식입니다.', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prisma.isLiked.deleteMany({
        where: { userId: req.user.userId, articleId: numArticleId },
      });

      res.status(HttpStatus.OK).json({ message: '좋아요가 취소되었습니다.' });
    } catch (error) {
      throw new HttpException('좋아요 삭제 중 오류가 발생했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
