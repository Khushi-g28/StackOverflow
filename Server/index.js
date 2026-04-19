import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js"
import questionroute from "./routes/question.js"
import answerroutes from "./routes/answer.js"
import languageroutes from "./routes/language.js"
import payment from "./routes/paymentroutes.js"
import auth from "../middleware/auth.js";
import postRoutes from "../routes/post.js";
import authRoutes from "../routes/auth.js";
import reward from "../routes/reward.js";
const app = express();
app.get("/",(req,res)=>{
  res.send("API is running");
})
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/post', postRoutes);
app.get("/", (req, res) => {
  res.send("Stackoverflow clone is running perfect");
});
app.use('/user',userroutes)
app.use('/question',questionroute)
app.use('/answer',answerroutes)
app.use('/language',languageroutes)
app.use('/payment',payment)

app.use("/uploads", express.static("uploads"));
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/rewards", reward);
const PORT = process.env.PORT || 5000;
const databaseurl = process.env.MONGODB_URL;

mongoose
  .connect(databaseurl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
