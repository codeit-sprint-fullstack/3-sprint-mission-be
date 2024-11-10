import express from "express";
import { createMarketComment, getMarketComments } from "../controllers/marketCommentController.js";
import { createCommunityComment, getCommunityComments } from "../controllers/communityCommentController.js";

const router = express.Router();

router.post("/market", createMarketComment); 
router.get("/market", getMarketComments);     

router.post("/community", createCommunityComment); 
router.get("/community", getCommunityComments);   

export default router;
