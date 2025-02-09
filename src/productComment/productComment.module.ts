import { Module } from '@nestjs/common';
import { ProductCommentService } from './productComment.service';
import { ProductCommentController } from './productComment.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductCommentController],
  providers: [ProductCommentService],
  exports: [ProductCommentService],
})
export class ProductCommentModule {}
