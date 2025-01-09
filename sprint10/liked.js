import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();
app.use(express.json());
app.use(cors({origin: "*", credentials: true}));

const app = express();

// 좋아요 추가 API
app.post('/products/:id/favorite', async (req, res) => {
  const { productId } = req.body;

  const transaction = await sequelize.transaction();
  try {
    // 사용자가 이미 좋아요를 눌렀는지 확인
    const existingLike = await Like.findOne({
      where: { userId: loggedInUserId, productId },
      transaction,
    });

    if (existingLike) {
      return res.status(400).json({ error: '이미 좋아요를 눌렀습니다.' });
    }

    // 좋아요 추가
    await Like.create({ userId: loggedInUserId, productId }, { transaction });

    await transaction.commit();
    res.status(200).json({ message: '좋아요가 추가되었습니다.' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: '좋아요 추가 중 문제가 발생했습니다.', details: error.message });
  }
});

// 좋아요 취소 API
app.delete('/products/:id/favorite', async (req, res) => {
  const { productId } = req.body;

  const transaction = await sequelize.transaction();
  try {
    // 사용자가 좋아요를 눌렀는지 확인
    const existingLike = await Like.findOne({
      where: { userId: loggedInUserId, productId },
      transaction,
    });

    if (!existingLike) {
      return res.status(400).json({ error: '좋아요를 누르지 않았습니다.' });
    }

    // 좋아요 취소
    await existingLike.destroy({ transaction });

    await transaction.commit();
    res.status(200).json({ message: '좋아요가 취소되었습니다.' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: '좋아요 취소 중 문제가 발생했습니다.', details: error.message });
  }
});

// 상품 조회 API (isLiked 포함)
app.get('/api/products/:id', async (req, res) => {
  const productId = parseInt(req.params.id, 10);

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    }

    // 좋아요 여부 확인
    const isLiked = await Like.findOne({
      where: { userId: loggedInUserId, productId },
    });

    // 응답 객체
    res.status(200).json({
      product,
      isLiked: !!isLiked,
    });
  } catch (error) {
    res.status(500).json({ error: '상품 조회 중 문제가 발생했습니다.', details: error.message });
  }
});
