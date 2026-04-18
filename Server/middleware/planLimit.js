const User = require("../models/User");

export const planLimit = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const limits = {
    FREE: 1,
    BRONZE: 5,
    SILVER: 10,
    GOLD: Infinity,
  };

  const today = new Date().toDateString();

  if (user.lastQuestionDate?.toDateString() !== today) {
    user.questionsPostedToday = 0;
    user.lastQuestionDate = new Date();
  }

  if (user.questionsPostedToday >= limits[user.plan]) {
    return res.status(403).json({
      message: "Daily limit reached",
    });
  }

  user.questionsPostedToday += 1;
  await user.save();

  req.dbUser = user;
  next();

  //paymnet limit
  const now = new Date();
  const hour = now.getHours();

  if (hour < 10 || hour >= 11) {
    return res.status(403).json({
      message: "Payments allowed only between 10–11 AM IST",
    });
  }

  next();
};
export default planLimit;