import mongoose from "mongoose";

const userschema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String },
  tags: { type: [String] },
  joinDate: { type: Date, default: Date.now },
  lastforgotrequest: { 
    type: Date ,
    default: null},
  language:{
    type:String,
    default:"English"
  },
  otp: String,
  otpExpiry: Date,

 plan: {
    type: String,
    enum: ["FREE", "BRONZE", "SILVER", "GOLD"],
    default: "FREE",
  },
 
  points: {
    type: Number,
    default: 0,
  },


  questionsPostedToday: { type: Number, default: 0 },
  lastQuestionDate: Date,
});
export default mongoose.model("user", userschema);
