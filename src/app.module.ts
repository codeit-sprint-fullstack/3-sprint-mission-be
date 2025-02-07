import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { ArticlesService } from './articles/articles.service';
import { CommentsService } from './comments/comments.service';
import { ProductsService } from './products/products.service';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, ArticlesModule, CommentsModule, ProductsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, AuthService, ArticlesService, CommentsService, ProductsService],
})
export class AppModule {}
