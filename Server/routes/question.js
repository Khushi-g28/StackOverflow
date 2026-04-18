  const express = require("express");
import {
  Askquestion,
  deletequestion,
  getallquestion,
  votequestion,
} from "../controller/question.js";

const router = express.Router();
import auth from "../middleware/auth.js";
import planLimit from "../middleware/planLimit.js";
const postquestiondata = require("../controller/question.js");
router.post("/ask", auth, planLimit, Askquestion);
router.get("/getallquestion", getallquestion);
router.delete("/delete/:id", auth, deletequestion);
router.patch("/vote/:id", auth, votequestion);

export default router;