import { Request, Response } from 'express';
import { UploadService } from '../service/service';

export class UploadController {
  constructor(private uploadService: UploadService) {}

  generateUploadUrl = async (req: Request, res: Response) => {
    try {
      const { filename } = req.query;
      if (typeof filename !== 'string' || !filename) {
        return res.status(400).json({ message: '파일 이름이 필요합니다.' });
      }
      const { uploadUrl, imageUrl } = await this.uploadService.generateUploadUrl(filename);

      return res.json({ uploadUrl, imageUrl });
    } catch (error) {
      return res.status(500).json({ message: 'URL 생성 실패' });
    }
  };
}
