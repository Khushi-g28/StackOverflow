const express = require("express");
import {
  getallusers,
  Login,
  Signup,
  updateprofile,
  forgotpassword
} from "../controller/auth.js";

const router = express.Router();
const jwt = require("jsonwebtoken");
import auth from "../middleware/auth.js";
router.post("/signup", Signup);
router.post("/login", Login);
router.post("/verify-otp", auth.verifyOtp);
router.get("/history/:email", auth.getHistory);
router.post("/forgotpassword", forgotpassword);
router.get("/getalluser", getallusers);
router.patch("/update/:id", auth,updateprofile);

router.post("/login", (req, res) => {
  const user = { id: "123" }; // demo

  const token = jwt.sign(user, process.env.JWT_SECRET);

  res.json({ token });
});
export default router;





