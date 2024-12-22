import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const Create = async (req, res) => {
  const body = req.body || {};
  if (!body.userUuid) body.userUuid = "9cd3b725-e623-43a3-8ade-1f5a394fb43f";

  try {
    console.log(body);
    const createData = await prisma.board.create({
      data: body,
    });
    res.status(201).send(createData);
  } catch (err) {
    console.error(err);
  }
};

const GetData = async (req, res) => {
  const pageSize = Number(req.query.pageSize) || 0;
  const skip = (req.query.page - 1) * pageSize || 0;
  const orderBy =
    !req.query.orderBy || req.query.orderBy === "recent"
      ? { boardNumber: "desc" }
      : { favorite: "desc" };
  const keyword = req.query.keyword || "";
  try {
    const data = await prisma.board.findMany({
      where: {
        title: {
          contains: keyword,
          mode: "insensitive",
        },
      },
      orderBy,
      skip,
      take: pageSize,
      include: {
        user: true,
      },
    });
    res.status(200).send(data);
  } catch (err) {
    console.error(err);
  }
};

const GetItem = async (req, res) => {
  const { boardNumber } = req.params;
  try {
    const item = await prisma.board.findUnique({
      where: {
        boardNumber: Number(boardNumber),
      },
      include: {
        user: true,
        coment: true,
      },
    });
    res.status(200).send(item);
  } catch (err) {
    console.error(err);
  }
};

const DeleteItem = async (req, res) => {
  const { boardNumber } = req.params;
  try {
    const item = await prisma.board.delete({
      where: {
        boardNumber: Number(boardNumber),
      },
    });
    res.status(204).send({
      success: true,
    });
  } catch (err) {
    console.log(err);
  }
};

const service = {
  Create,
  GetData,
  GetItem,
  DeleteItem,
};
export default service;
