import JWT from "jsonwebtoken";
import User from "../models/userModel.js"; // Import the user model

// USER AUTHENTICATION CHECK
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies; // Assuming token is stored in cookies

  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized User: No token provided",
    });
  }

  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = await User.findById(decoded._id); // Retrieve user by decoded ID
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    console.error("JWT Error:", error);
    return res.status(401).send({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ADMIN AUTHENTICATION CHECK
export const isAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).send({
      success: false,
      message: "Admin access only",
    });
  }
  next(); // Allow access if the user is an admin
};
