import User from "../models/User.js";
import Answer from "../models/Answer.js";

// ✅ Get Profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

// ✅ Get all answers
export const getAnswers = async (req, res) => {
  const answers = await Answer.find().populate("user", "name");
  res.json(answers);
};

// ✅ Add Answer (+5 points)
export const addAnswer = async (req, res) => {
  const answer = await Answer.create({
    content: req.body.content,
    user: req.user.id,
  });

  await User.findByIdAndUpdate(req.user.id, {
    $inc: { points: 5 },
  });

  res.json({ message: "Answer added (+5 points)" });
};

// ✅ Upvote (+5 when reaches 5)
export const upvoteAnswer = async (req, res) => {
  const answer = await Answer.findById(req.params.id);

  answer.upvotes += 1;
  await answer.save();

  if (answer.upvotes === 5) {
    await User.findByIdAndUpdate(answer.user, {
      $inc: { points: 5 },
    });
  }

  res.json({ message: "Upvoted" });
};

// Transfer Points
export const transferPoints = async (req, res) => {
  const { receiverId, points } = req.body;

  const sender = await User.findById(req.user.id);

  if (sender.points <= 10) {
    return res
      .status(400)
      .json({ message: "Minimum 10+ points required" });
  }

  if (sender.points < points) {
    return res.status(400).json({ message: "Not enough points" });
  }

  await User.findByIdAndUpdate(req.user.id, {
    $inc: { points: -points },
  });

  await User.findByIdAndUpdate(receiverId, {
    $inc: { points: points },
  });

  res.json({ message: "Points transferred successfully" });
};