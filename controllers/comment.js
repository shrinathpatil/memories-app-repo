import Comment from "../models/Comment.js";

export const addComment = async (req, resp) => {
  try {
    const { postId, user, message } = req.body;
    const newComment = await Comment.update(
      { postId: postId },
      { $push: { comments: { user, message } } },
      { upsert: true }
    );

    resp.status(200).json(newComment);
  } catch (e) {
    resp.status(500).json(e);
  }
};

export const getComments = async (req, resp) => {
  try {
    const { id } = req.params;
    const { comments } = await Comment.findOne({ postId: id }).sort({
      createdAt: -1,
    });

    resp.status(200).json(comments);
  } catch (e) {
    resp.status(500).json(e);
  }
};
