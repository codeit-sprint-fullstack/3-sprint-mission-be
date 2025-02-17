import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageService {
  s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY')!,
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY')!,
      },
    });
  }

  async imageUploadToS3(
    // fileName: string, // 업로드될 파일의 이름
    // file: Express.Multer.File, // 업로드할 파일
    // ext: string, // 파일 확장자
    file: Express.Multer.File,
  ) {
    const ext = file.originalname.split('.').pop();
    const imageName = new Date().getTime() + Math.floor(Math.random() * 1000);
    console.log('ext:', ext);
    console.log('imageName:', imageName);
    const fileName = `${imageName}.${ext}`;
    console.log('fileName:', fileName);

    // AWS S3에 이미지 업로드 명령을 생성합니다. 파일 이름, 파일 버퍼, 파일 접근 권한, 파일 타입 등을 설정합니다.
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3 버킷 이름
      Key: fileName, // 업로드될 파일의 이름
      Body: file.buffer, // 업로드할 파일
      // ACL: 'public-read', // 파일 접근 권한
      ContentType: `image/${ext}`, // 파일 타입
    });

    // 생성된 명령을 S3 클라이언트에 전달하여 이미지 업로드를 수행합니다.
    await this.s3Client.send(command);

    // 업로드된 이미지의 URL을 반환합니다.
    return {
      url: `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_S3_BUCKET_NAME}/${fileName}`,
    };
  }

  async imagesUploadToS3(files: Express.Multer.File[]) {
    const uploadedUrls: { url: string }[] = [];
    for (const file of files) {
      try {
        const url = await this.imageUploadToS3(file);
        uploadedUrls.push(url);
      } catch (error) {
        console.error(`Error uploading ${file.originalname}:`, error);
      }
    }
    return { url: uploadedUrls.map((u) => u.url) };
  }
}
