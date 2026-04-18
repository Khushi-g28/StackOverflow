const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const paymentTime = require("../middleware/paymentTime");

const {
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/create-order", auth, paymentTime, createOrder);
router.post("/verify", auth, verifyPayment);

module.exports = router;