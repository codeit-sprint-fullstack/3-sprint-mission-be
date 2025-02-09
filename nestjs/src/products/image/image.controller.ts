import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: '이미지 업로드',
    description: '이미지를 업로드합니다.',
  })
  // uploadImage(@UploadedFile() file: Express.Multer.File) {
  //   return { message: '이미지 업로드 성공', fileName: file.originalname };
  // }
  uploadImage() {
    return 'image upload';
  }
}
