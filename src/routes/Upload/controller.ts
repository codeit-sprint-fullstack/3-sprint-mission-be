import { Request, Response } from 'express';
import { UploadService } from './service';

export class UploadController {
  constructor(private uploadService: UploadService) {}

  uploadFiles = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];
      const result = this.uploadService.uploadFiles(files);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === '파일이 존재하지 않습니다.') {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: '파일 업로드 중 오류가 발생했습니다.' });
    }
  };
}
