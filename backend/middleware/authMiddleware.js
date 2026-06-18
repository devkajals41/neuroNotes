import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {

    let token;

    // Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      // Extract token from:
      // Bearer eyJhbGciOi...
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // Find the logged-in user
      req.user = await User.findById(decoded.id).select("-password");

      // Move to next function
      next();

    } else {

      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });

    }

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });

  }
};

export default protect;