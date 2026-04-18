import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedata = jwt.verify(token, process.env.JWT_SECRET);
    req.userid = decodedata?.id;
    next();
  } catch (error) {
    console.log(error);
  }
};
  
export const isAuthenticated =async (req, res, next) => {
  try {
    const user=await user.findById(req.userid);
    if(!user){
      return res.status(401).json({message:"Unauthorized"});
    } else {
      req.userId = user;
      next();
    } 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
}

export default isAuthenticated;