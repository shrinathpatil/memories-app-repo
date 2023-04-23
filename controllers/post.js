import mongoose from "mongoose";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, resp) => {
  const body = req.body;
  try {
    const post = new Post(body);

    const sPost = await post.save();
    resp.status(201).json(sPost);
  } catch (e) {
    resp.status(409).json(e);
  }
};

export const getPosts = async (req, resp) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    resp.status(200).json(posts);
  } catch (e) {
    resp.status(500).json(e);
  }
};

export const getPost = async (req, resp) => {
  try {
    const { id: _id } = req.params;
    const post = await Post.findById(_id);

    resp.status(200).json(post);
  } catch (e) {
    resp.status(500).json(e);
  }
};

export const getUserPosts = async (req, resp) => {
  try {
    const { userId: creatorId } = req.params;
    const posts = await Post.find({ creatorId }).sort({ createdAt: -1 });

    resp.status(200).json(posts);
  } catch (e) {
    resp.status(500).json(e);
  }
};

export const updatePost = async (req, resp) => {
  const { id: _id } = req.params;
  const post = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return resp.status(404).send("No post with that id");
    }
    const updatedPost = await Post.findByIdAndUpdate(_id, post, { new: true });

    resp.status(200).json(updatedPost);
  } catch (e) {
    resp.status(500).json(e);
  }
};

export const deletePost = async (req, resp) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return resp.status(404).send("No post with that id");
    }
    await Post.findByIdAndDelete(_id);
    resp
      .status(200)
      .json({ success: true, message: "post delted successfully" });
  } catch (e) {
    console.log(e);
    resp.status(500).json(e);
  }
};

export const likePost = async (req, resp) => {
  const { id: _id, userId } = req.params;
  console.log(req.params);
  try {
    const user = await User.findById(userId);

    if (user.likedPosts.includes(_id)) {
      const updatedPost = await Post.findByIdAndUpdate(
        _id,
        { $inc: { likeCount: -1 } },
        { new: true }
      );

      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: _id } });

      resp.status(200).json(updatedPost);
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        _id,
        { $inc: { likeCount: 1 } },
        { new: true }
      );

      await User.findByIdAndUpdate(userId, { $push: { likedPosts: _id } });

      resp.status(200).json(updatedPost);
    }
  } catch (e) {
    resp.status(500).json(e);
  }
};
