import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createArticle(@Req() req, @Body() body) {
    const { title, content, imageUrl } = body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    return this.articleService.createArticle(userId, title, content, imageUrl);
  }

  @Get()
  async getAllArticles(
    @Query('sort') sort: string = 'latest',
    @Query('search') search?: string,
    @Query('pageSize') pageSize: string = '6',
  ) {
    return this.articleService.getAllArticles(sort, search, Number(pageSize));
  }

  @Get('best')
  async getBestArticles() {
    return this.articleService.getBestArticles();
  }
}
