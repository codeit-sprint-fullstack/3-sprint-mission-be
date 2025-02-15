import Express from 'express';
import { UploadService } from './service';
import { UploadController } from './controller';
import asyncRequestHandler from '@/core/handlers/asyncRequestHandler';

const uploadService = new UploadService(process.env.SERVER_ADDRESS!);
const uploadController = new UploadController(uploadService);
const router = Express.Router();

router.get('/url', asyncRequestHandler(uploadController.generateUploadUrl));

export default router;
