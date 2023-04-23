import express from "express";
import {
  createUser,
  googleLogin,
  loginUser,
  getUser,
} from "../controllers/user.js";

import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//todo: create user
router.post("/create", createUser);

//todo: google Login
router.post("/google", googleLogin);

//todo: login user
router.post("/login", loginUser);

//todo: get User
router.get("/:id", verifyToken, getUser);

export default router;
