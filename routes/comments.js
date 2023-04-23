import express from "express";
import { addComment, getComments } from "../controllers/comment.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//todo :add comment;
router.post("/add", verifyToken, addComment);

//todo: get Comments
router.get("/:id", getComments);

export default router;
