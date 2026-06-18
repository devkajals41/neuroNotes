// ==========================================
// AUTH ROUTES
// ==========================================

// Express Router helps us create routes
// in separate files instead of putting
// everything inside server.js

import express from "express";


// Import controller functions

import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";


// Create router object

const router = express.Router();


// ==========================================
// REGISTER ROUTE
// ==========================================

// POST /api/auth/register

router.post("/register", registerUser);



// ==========================================
// LOGIN ROUTE
// ==========================================

// POST /api/auth/login

router.post("/login", loginUser);



// Export router

export default router;