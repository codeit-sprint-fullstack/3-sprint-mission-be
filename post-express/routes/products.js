import express from 'express';
import { assert } from 'superstruct';
import { CreateComment, PatchComment } from '../structs.js';
import { prisma } from '../prismaClient.js'; // 경로 수정
import authenticate from '../middleware/auth.js';

const router = express.Router();

//상품 상세 조회
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
      where: {
          id: parseInt(id, 10),
      },
      select: {
          id: true,
          name: true,
          description: true,
          price: true,
          tags: true,
          createdAt: true,
      },
  });
  res.status(200).send(product);
});

//상품 조회
router.get("/", async (req, res) => {
  const { searchKeyword, limit = 10, offset = 0 } = req.query;
  const products = await prisma.product.findMany({
      skip: Number(offset),
      take: Number(limit),
      orderBy: { createdAt: "asc" },
      where: searchKeyword ? {
          OR: [
              { name: { contains: searchKeyword, mode: "insensitive" } },
              { description: { contains: searchKeyword, mode: "insensitive" } },
          ],
      } : {},
      select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
      },
  });
  res.status(200).send(products);
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  // 상품 등록 
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
  
  // 상품 수정 
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
  
  // 상품 삭제 
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

  
// '좋아요' 추가 
router.post('/:productId/like', authenticate, async (req, res) => {
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
  
  // '좋아요' 삭제 
  router.delete('/:productId/like', authenticate, async (req, res) => {
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

// 댓글 등록
router.post("/:articleId/comments", authenticate, async (req, res) => {
    const { articleId } = req.params;
    const numId = parseInt(articleId, 10);
    const { content } = req.body;
    if (!content) {
        return res.status(400).send({ message: "Content is required." });
    }
    assert(req.body, CreateComment);
    const commentEntity = await prisma.$transaction(async (tx) => {
        const targetArticleEntity = await tx.article.findUnique({
            where: {
                id: numId,
            },
        });
        if (!targetArticleEntity) {
            return res.status(404).send({ message: "Article not found" });
        }
        return await tx.articleComment.create({
            data: {
                articleId: numId,
                content: content,
                userId: req.user.userId, // 댓글 작성자
            },
        });
    });

    res.status(201).send(commentEntity);
});




// 댓글 목록 조회 
router.get("/", async (req, res) => {
    const { limit = 10 } = req.query;
    const comments = await prisma.productComment.findMany({
        orderBy: { createdAt: "asc" },
        take: parseInt(limit),
    });
    res.status(201).send(comments);
});

export default router;

