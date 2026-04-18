import mongoose from "mongoose";
import user from "../models/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {sendOtp} from "../utils/sendOtp.js";
//import LoginHistory from "../models/LoginHistory.js";




export const Signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exisitinguser = await user.findOne({ email });
    if (exisitinguser) {
      return res.status(404).json({ message: "User already exist" });
    }
    const token = jwt.sign(
      { email: newuser.email, id: newuser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const hashpassword = await bcrypt.hash(password, 12);
    const newuser = await user.create({
      name,
      email,
      password: hashpassword,
    });
    res.status(200).json({ data: newuser, token });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const Login = async (req, res) => {
  const { email, password , deviceInfo} = req.body;
  try {
    const exisitinguser = await user.findOne({ email });
    if (!exisitinguser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const ispasswordcrct = await bcrypt.compare(
      password,
      exisitinguser.password
    );
    if (!ispasswordcrct) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { email: exisitinguser.email, id: exisitinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ data: exisitinguser, token });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }

  // 📱 Mobile time restriction
  const hour = new Date().getHours();
  if (deviceInfo.device === "mobile" && (hour < 10 || hour > 13)) {
    return res.status(403).json({
      message: "Mobile login allowed only between 10AM–1PM"
    });
  }

  // 💾 Save login history
  await LoginHistory.create({
    email,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    device: deviceInfo.device,
    ip: req.ip
  });
  
  // Chrome → OTP required
  if (deviceInfo.browser === "Chrome") {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    await user.save();

    await sendOtp(email, otp);

    return res.json({ requireOtp: true });
  }

  //  Edge → Direct login
  return res.json({ message: "Login Success" });
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (user.otp === otp) {
    user.otp = null;
    await user.save();

    return res.json({ message: "OTP Verified - Login Success" });
  }

  return res.status(400).json({ message: "Invalid OTP" });
};

exports.getHistory = async (req, res) => {
  const history = await LoginHistory.find({ email: req.params.email }).sort({ time: -1 });
  res.json(history);
};

export const getallusers = async (req, res) => {
  try {
    const alluser = await user.find();
    res.status(200).json({ data: alluser });
  } catch (error) {
    res.status(500).json("something went wrong..");
    return;
  }
};
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "User unavailable" });
  }
  try {
    const updateprofile = await user.findByIdAndUpdate(
      _id,
      { $user: { name: name, about: about, tags: tags } },
      { new: true }
    );
    res.status(200).json({ data: updateprofile });
  } catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};
export const forgotpassword = async (req, res) => {
  try {
  const { email, phone } = req.body;
  const exisitinguser = await user.findOne({ $or: [{ email }, { phone }] });
  if (!exisitinguser) {
    return res.status(404).json({ message: "User does not exist" });}
    //daily limit
    if (exisitinguser.lastforgotrequest && issameDay(exisitinguser.lastforgotrequest)) {
      return res.status(400).json({ message: "You can only request a password reset once per day." });
    }
   //generate password
    const newpassword = generateRandomPassword();
    exisitinguser.password= newpassword;
    exisitinguser.lastforgotrequest = new Date();
    await exisitinguser.save();
    return res.status(200).json({ message:"password reset successfully", newpassword }); //frontend show it
  }catch (error) {
    console.log(error);
    res.status(500).json("something went wrong..");
    return;
  }
};
//functions for forgot password
function issameDay(date1, date2) {
  return date1.toDataeString() === date2.toDateString();
}
function generateRandomPassword(length = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}