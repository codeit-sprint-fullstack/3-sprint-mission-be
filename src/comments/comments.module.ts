import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService],
  exports: [CommentsService],
})
export class CommentsModule {}
