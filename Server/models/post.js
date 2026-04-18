import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  content: String,
  media: String,
  mediaType: String,
  likes: [String],
  comments: [
    {
      user: String,
      text: String,
    }
  ]
}, { timestamps: true });

export default mongoose.model("Post", postSchema);