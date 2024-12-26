import express from 'express';
import { prisma } from '../prismaClient.js';
import authenticate from '../middleWare/auth.js';

const router = express.Router();

// '좋아요' 추가 엔드포인트
router.post('/like', authenticate, async (req, res) => {
  const { productId } = req.body;

  try {
    const like = await prisma.like.create({
      data: {
        userId: req.user.userId,
        productId: parseInt(productId, 10),
      },
    });

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ message: '좋아요 추가 중 오류가 발생했습니다.', error });
  }
});

// '좋아요' 삭제 엔드포인트
router.delete('/like', authenticate, async (req, res) => {
  const { productId } = req.body;

  try {
    await prisma.like.deleteMany({
      where: {
        userId: req.user.userId,
        productId: parseInt(productId, 10),
      },
    });

    res.status(200).json({ message: '좋아요가 취소되었습니다.' });
  } catch (error) {
    res.status(500).json({ message: '좋아요 삭제 중 오류가 발생했습니다.', error });
  }
});

export default router;
