import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 댓글 등록
export const createComment = async (req, res) => {
  const { postId, userId, content, postType } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        postId,
        userId,
        content,
        postType,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "댓글 등록에 실패했습니다." });
  }
};

// 댓글 수정
export const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(commentId) },
      data: { content },
    });
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ error: "댓글 수정에 실패했습니다." });
  }
};

// 댓글 삭제
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    await prisma.comment.delete({
      where: { id: parseInt(commentId) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "댓글 삭제에 실패했습니다." });
  }
};

// 댓글 목록 조회
export const getComments = async (req, res) => {
  const { postId, postType } = req.query;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: parseInt(postId),
        postType,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "댓글 목록 조회에 실패했습니다." });
  }
};
