import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ✅ ConfigModule 추가
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { ArticleModule } from './article/article.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';
import { ImageModule } from './image/image.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtGlobalModule } from './auth/jwt.module';
import { ArticlecommentController } from './articlecomment/articlecomment.controller';
import { ArticlecommentService } from './articlecomment/articlecomment.service';
import { ArticlecommentModule } from './articlecomment/articlecomment.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductCommentModule } from './productComment/productComment.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    JwtGlobalModule,
    PrismaModule,
    UserModule,
    ArticleModule,
    ProductModule,
    ImageModule,
    AuthModule,
    ProductCommentModule,
    ArticlecommentModule,
  ],
  controllers: [
    AppController,
    UserController,
    ProductController,
    AuthController,
    ArticlecommentController,
  ],
  providers: [
    AppService,
    UserService,
    ProductService,
    AuthService,
    ArticlecommentService,
  ],
  exports: [JwtModule],
})
export class AppModule {}
