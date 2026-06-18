import jwt from "jsonwebtoken";

// Creates a token containing the user's id
const generateToken = (id) => {
  return jwt.sign(
    { id },                 // Payload
    process.env.JWT_SECRET, // Secret key
    {
      expiresIn: "7d",
    }
  );
};

export default generateToken;