const Razorpay = require("razorpay");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

//send email after payment  

module.exports = async (email, plan) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Subscription Activated",
    text: `Your ${plan} plan is activated successfully.`,
  });
};




exports.createOrder = async (req, res) => {
  const { plan } = req.body;

  const prices = {
    BRONZE: 100,
    SILVER: 300,
    GOLD: 1000,
  };

  const order = await razorpay.orders.create({
    amount: prices[plan] * 100,
    currency: "INR",
  });

  res.json(order);
};
//verify payment and update user plan   
exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment" });
  }

  const user = await User.findById(req.user.id);
  user.plan = plan;
  await user.save();

  await sendEmail(user.email, plan);

  res.json({ message: "Payment successful" });
};