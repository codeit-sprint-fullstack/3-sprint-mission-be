import express from 'express';
import multer from 'multer';
import { prisma } from '../prismaClient.js';
import authenticate from '../middleWare/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 상품 등록 엔드포인트
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  const { name, description, price, tags } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        tags: tags.split(','),
        image,
        userId: req.user.userId, // 상품 등록자
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: '상품 등록 중 오류가 발생했습니다.', error });
  }
});

// 상품 수정 엔드포인트
router.patch('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, tags } = req.body;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!product || product.userId !== req.user.userId) {
      return res.status(403).json({ message: '수정 권한이 없습니다.' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id, 10) },
      data: { name, description, price: parseFloat(price), tags: tags.split(',') },
    });

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: '상품 수정 중 오류가 발생했습니다.', error });
  }
});

// 상품 삭제 엔드포인트
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!product || product.userId !== req.user.userId) {
      return res.status(403).json({ message: '삭제 권한이 없습니다.' });
    }

    await prisma.product.delete({
      where: { id: parseInt(id, 10) },
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: '상품 삭제 중 오류가 발생했습니다.', error });
  }
});

export default router;
