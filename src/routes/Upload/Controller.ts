import { Router } from 'express';
import { uploadImage } from '../../utils/imgUpload';
import { uploadFile } from './Service';
import asyncRequestHandler from '../../utils/asyncRequestHandler';

const router = Router();

router.post('/image', uploadImage(3), asyncRequestHandler(uploadFile));

export default router;
