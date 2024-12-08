import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

//try {} catch(err) {console.error(err);}

//게시글 등록
router.post("/postregistration", async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log(req.body);
    const createPostregistration = await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).send(createPostregistration);
  } catch (err) {
    console.error(err);
  }
});

//게시글 목록 조회 API
router.get("/articleList", async (req, res) => {
  try {
    const { limit = 10, offset = 0, order = "recent" } = req.query;
    const users = await prisma.article.findMany({
      skip: Number(offset),
      take: Number(limit),
    });
    res.send(users);
  } catch (err) {
    console.error(err);
  }
});

//게시글 수정 api
router.patch("/postPatch", async (req, res) => {
  try {
    const { title, content, id } = req.body;
    const postPatch = await prisma.article.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });
    res.send({
      success: true,
      updateData: postPatch,
    });
  } catch (err) {
    console.error(err);
  }
});

// 삭제 api
router.delete("/postDelete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const postDelete = await prisma.article.delete({
      where: {
        id,
      },
    });
    res.send({
      success: true,
      postDelete: postDelete,
    });
  } catch (err) {
    console.error(err);
  }
});

//조회
router.post("/postget", async (req, res) => {
  try {
    const { title } = req.body;
    console.log(title);
    const postGet = await prisma.article.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
    });
    res.send({
      success: "ㅇㄹㅇㄹ",
      postGet: postGet,
    });
  } catch (err) {
    console.error(err);
  }
});

router.get("/freeboard", async (req, res) => {
  const { orderBy } = req.query;
  const sort = orderBy === "latest" ? { createdAt: "desc" } : { like: "desc" };
  // ("/aaa/bbb?abc=1&ccc=1");
  try {
    const bestdata = await prisma.freeboard.findMany({
      orderBy: {
        like: "desc", //desc 오름차 asc 내림차
      },
      take: 3,
      include: {
        user: true,
      },
    });
    const data = await prisma.freeboard.findMany({
      orderBy: sort,
      include: {
        user: true,
      },
    });

    res.send({
      data,
      bestdata,
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/freeboard", async (req, res) => {
  const body = req.body;
  body.userid = "edd1fda0-9975-485f-a7a0-39ccad4c0550";
  try {
    console.log(body);
    const create = await prisma.freeboard.create({
      data: body,
    });
    res.send("성공");
  } catch (err) {
    console.error(err);
  }
});

router.post("/comment", async (req, res) => {
  const body = req.body;

  body.userid = "edd1fda0-9975-485f-a7a0-39ccad4c0550";

  try {
    await prisma.comment.create({
      data: body,
    });
    const comment = await prisma.comment.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send({
      data: comment,
    });
  } catch (err) {
    console.error(err);
  }
});
export default router;
