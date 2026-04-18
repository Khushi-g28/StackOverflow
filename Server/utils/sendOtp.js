const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const express = require("express");
//import auth from "../controller/auth.js";
export const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is: ${otp}</h2>`
  });
};
module.exports = sendOtp;
export default sendOtp;