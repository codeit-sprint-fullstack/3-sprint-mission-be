import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

// import boardMock from "./mock/board.json" assert { type: "json" };
// import userMock from "./mock/user.json" assert { type: "json" };
const boardMock = JSON.parse(
  await readFile(new URL("./mock/board.json", import.meta.url))
);
const userMock = JSON.parse(
  await readFile(new URL("./mock/user.json", import.meta.url))
);

const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.user.deleteMany();
    await prisma.user.createMany({
      data: userMock,
    });
    const user = await prisma.user.findMany({});
    const board = boardMock.map((v) => {
      const random = Math.floor(Math.random() * user.length);
      return { ...v, userUuid: user[random].uuid };
    });
    console.log(board);
    await prisma.board.deleteMany();
    await prisma.board.createMany({
      data: board,
    });
    console.log("user 성공");
    console.log("board 성공");
  } catch (err) {
    console.error(err);
  }
}
main();
