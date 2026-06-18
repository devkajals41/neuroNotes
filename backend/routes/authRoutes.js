import express from "express";

console.log("AUTH ROUTES LOADED");

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

// Test Route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth routes working",
  });
});

// Register User
router.post("/register", registerUser);


// Login User
router.post("/login", loginUser);

export default router;