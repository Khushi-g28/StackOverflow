import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  content: String,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  upvotes: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Answer", answerSchema);