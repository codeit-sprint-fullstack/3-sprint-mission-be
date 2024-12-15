// 중고 마켓 댓글 API

import { createComment, getComments } from "./commentsController";

export const createMarketComment = async (req, res) => {
  req.body.postType = "market";
  return createComment(req, res);
}

export const getMarketComments = async (req, res) => {
  req.query.postType = "market";
  return getComments(req, res);
}