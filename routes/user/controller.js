import express from "express";
import service from "./service.js";
import auth from "../../middlewares/auth.js";
import { PrismaClient } from "@prisma/client";

// import bcrypt from "bcrypt";

const router = express.Router();
const prisma = new PrismaClient();
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // const saltRounds = 10;
    // const salt = await bcrypt.genSalt(saltRounds);
    await prisma.user.create({
      data: { name, email, password },
    });
    res.status(201).send("create");
  } catch (err) {
    if (err.code === "P2002") {
      console.error("email 중복");
      res.status(404).send("Email 중복");
      return;
    }
    console.error(err);
  }
});
router.post("/login", async (req, res) => {
  console.log("start");
  try {
    const { email, password } = req.body;
    const user = await service.getUser(email, password);
    const accessToken = service.createToken(user);
    const refreshToken = service.createToken(user, "refresh");
    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
  }
});

router.get("/", auth.verifyAccessToken, async (req, res) => {
  try {
    if (req.user) {
      const user = await service.getUserToken(req.user.userId);
      res.status(201).send(user);
    } else res.status(401).send({});
  } catch (err) {
    console.error(err);
  }
});

router.get("/logout", auth.verifyAccessToken, async (req, res) => {
  try {
    res.status(201).send({ accecssToken: null });
  } catch (err) {
    console.error(err);
  }
});
// router.post("/test", auth.verifySessionLogin, service.test);
router.post("/test1", auth.verifyAccessToken, service.test);
export default router;
