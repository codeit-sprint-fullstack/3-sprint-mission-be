import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { ProductsModule } from './products/products.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ 환경 변수 글로벌 설정
    AuthModule,
    ArticlesModule,
    CommentsModule,
    ProductsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService], // ✅ 개별 서비스는 포함할 필요 없음
})
export class AppModule {}
