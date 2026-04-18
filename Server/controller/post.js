import Post from "../models/post.js";

// Create Post
export const createPost = async (req, res) => {
  const newPost = new Post({
    user: req.user.id,
    content: req.body.content,
    media: req.file ? req.file.path : "",
    mediaType: req.file?.mimetype.startsWith("video") ? "video" : "image",
  });

  await newPost.save();
  res.json(newPost);
};

// Get Posts
export const getPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
};

// Like Post
export const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post.likes.includes(req.user.id)) {
    post.likes = post.likes.filter(id => id !== req.user.id);
  } else {
    post.likes.push(req.user.id);
  }

  await post.save();
  res.json(post);
};

// Comment
export const commentPost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.comments.push({
    user: req.user.id,
    text: req.body.text
  });

  await post.save();
  res.json(post);
};