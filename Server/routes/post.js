const express = require("express");
import multer from "multer";
import {
  createPost,
  getPosts,
  likePost,
  commentPost
} from "../controller/post.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", protect, upload.single("file"), createPost);
router.get("/", getPosts);
router.put("/like/:id", protect, likePost);
router.post("/comment/:id", protect, commentPost);

export default router;