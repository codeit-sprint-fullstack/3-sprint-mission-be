import { Router } from "express";
import {
  createArticle,
  getArticle,
  updateArticle,
  deleteArticle,
  listArticles
} from "../controllers/articlesController.js";

const router = Router();

router.post("/", createArticle);           // 게시글 등록
router.get("/:id", getArticle);            // 특정 게시글 조회
router.put("/:id", updateArticle);         // 게시글 수정
router.delete("/:id", deleteArticle);      // 게시글 삭제
router.get("/", listArticles);             // 게시글 목록 조회

export default router;