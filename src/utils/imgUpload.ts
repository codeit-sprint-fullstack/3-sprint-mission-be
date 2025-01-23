import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const ensureDirectoryExists = (directory: string) => {
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
};

export const createImageUploader = () => {
  const uploadDir = `uploads`;
  ensureDirectoryExists(uploadDir);

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
};

export const uploadImage = (imageLimit: number) => {
  const uploader = createImageUploader();
  return uploader.array('image', imageLimit);
};
