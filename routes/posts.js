import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  getPost,
  getUserPosts,
} from "../controllers/post.js";
import { verifyToken } from "../utils/verifyToken.js";
const router = express.Router();

//todo: create Post
router.post("/", verifyToken, createPost);

//todo :get Posts
router.get("/", getPosts);

//todo: get single Post
router.get("/:id", getPost);

//todo: get userPosts
router.get("/user/:userId", verifyToken, getUserPosts);

//todo: update Post
router.patch("/:id", verifyToken, updatePost);

//todo: delete Post
router.delete("/:id", verifyToken, deletePost);

//todo: like Post
router.put("/:id/like/:userId", verifyToken, likePost);

export default router;
