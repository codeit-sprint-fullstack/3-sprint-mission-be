import Express from 'express';
import { UploadService } from './service';
import { UploadController } from './controller';
import { uploadImage } from '../../core/storage/local/localImageUploader';
import asyncRequestHandler from '../../core/handlers/asyncRequestHandler';

const uploadService = new UploadService(process.env.SERVER_ADDRESS!);
const uploadController = new UploadController(uploadService);
const router = Express.Router();

router.post('/image', uploadImage(3), asyncRequestHandler(uploadController.uploadFiles));

export default router;
