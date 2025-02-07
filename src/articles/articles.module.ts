import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaModule } from '../prisma/prisma.module'; // ✅ PrismaModule 추가

@Module({
  imports: [PrismaModule], // ✅ PrismaModule을 imports에 추가해야 PrismaService 사용 가능
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
