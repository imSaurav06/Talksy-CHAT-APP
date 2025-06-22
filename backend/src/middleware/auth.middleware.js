import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

//before update
export const protectRoute = async (req, res, next) => {
  try {
    //grab token frome cookie parser import in index.js
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //grab user from decoded token
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token auth.middleware.js" });
    }

    //find user in database
    const user = await User.findById(decoded.userId).select("-password");

    //if user is not found
    if (!user) {
      return res.status(404).json({ message: "Unauthorized - User not found auth.middleware.js" });
    }

    //next function chljaega automatic
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middlware", error.message);
    res
      .status(500)
      .json({ massage: "Internal server error auth.middleware.js" });
  }
};
