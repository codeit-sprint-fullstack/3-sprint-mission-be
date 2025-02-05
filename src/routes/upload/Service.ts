import { Request, Response } from 'express';

export const uploadFile = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    return res.status(400).json({ message: '파일이 존재하지 않습니다.' });
  }
  const imageUrls = files.map((file) => `${process.env.SERVER_ADDRESS}/uploads/${file.filename}`);

  res.status(200).json({
    imageUrls,
  });
};

interface UploadResult {
  imageUrls: string[];
}

export class UploadService {
  private serverAddress: string;

  constructor(serverAddress: string) {
    this.serverAddress = serverAddress;
  }

  uploadFiles(files: Array<{ filename: string }>): UploadResult {
    if (!files || files.length === 0) {
      throw new Error('파일이 존재하지 않습니다.');
    }

    const imageUrls = files.map((file) => `${this.serverAddress}/uploads/${file.filename}`);
    return { imageUrls };
  }
}
