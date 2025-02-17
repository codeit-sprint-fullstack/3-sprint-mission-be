import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ImageUploadDto } from './dto/image-upload.dto';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call

const MAX_FILES = 10;

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @ApiOperation({ summary: '게시글 작성, 수정 시 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    type: ImageUploadDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(200)
  @Post('upload')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.imageService.imageUploadToS3(file);
  }

  @ApiOperation({ summary: '게시글 작성, 수정 시 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '업로드할 파일',
    type: ImageUploadDto,
  })
  @UseInterceptors(FilesInterceptor('files', MAX_FILES)) // 최대 10개의 파일을 업로드할 수 있습니다.
  @HttpCode(200)
  @Post('uploads')
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
    return await this.imageService.imagesUploadToS3(files);
  }
}
