import express from "express";
import service from "./service.js";

const router = express.Router();
router.get("/", service.GetData);
router.get("/:boardNumber", service.GetItem);
router.post("/create", service.Create);
router.delete("/:boardNumber", service.DeleteItem);

export default router;
