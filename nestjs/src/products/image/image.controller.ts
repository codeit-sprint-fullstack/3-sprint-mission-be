import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Client } from '@aws-sdk/client-s3';
import { Express } from 'express';
import { diskStorage } from 'multer';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const s3 = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

@ApiTags('Image')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          // 파일명 충돌 방지를 위해 타임스탬프와 원본파일명을 사용합니다.
          const fileName = `${Date.now()}_${file.originalname}`;
          cb(null, fileName);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 최대 5MB 제한
    }),
  )
  @ApiOperation({
    summary: '이미지 업로드',
    description: '이미지를 S3에 업로드합니다.',
  })
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      url: `http://localhost:8080/uploads/${file.filename}`,
      message: '이미지 업로드 성공',
    };
  }
}
