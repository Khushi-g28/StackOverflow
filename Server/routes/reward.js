const express = require("express"); 
import auth from "../middleware/auth.js";

import {
  getProfile,
  getAnswers,
  addAnswer,
  upvoteAnswer,
  transferPoints,
} from "../controllers/rewardController.js";

const router = express.Router();

router.get("/user/profile", auth, getProfile);
router.get("/answers", auth, getAnswers);

router.post("/rewards/answer", auth, addAnswer);
router.post("/rewards/upvote/:id", auth, upvoteAnswer);
router.post("/rewards/transfer", auth, transferPoints);

export default router;