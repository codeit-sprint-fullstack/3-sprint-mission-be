import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [ConfigModule],
})
export class ImageModule {}
