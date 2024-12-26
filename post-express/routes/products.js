import express from 'express';
import { prisma } from '../prismaClient.js'; // 경로 수정

const router = express.Router();


router.post("/", async (req, res) => {
    const createProduct = await prisma.product.create({
        data: req.body,
    });
    res.status(201).send(createProduct);
});

router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await prisma.product.update({
        data: req.body,
        where: {
            id: parseInt(id, 10),
        },
    });
    res.status(201).send(updatedProduct);
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
        where: {
            id: parseInt(id, 10),
        },
    });
    res.sendStatus(204);
});

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

export default router;
