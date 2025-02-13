import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [PrismaModule],
})
export class ImageModule {}
