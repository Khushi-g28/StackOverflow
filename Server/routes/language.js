const express = require("express");
import auth from "../middleware/auth.js";
import { requestOTP, verifyOTP } from "../controller/language.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();
router.post("/request-otp", auth, requestOTP);
router.post("/verify-otp", auth, verifyOTP);
export default router;

