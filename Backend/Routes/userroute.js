const express = require('express');
const {
  adduser,
  loginuser,
  getuser,
  getProfile,
  logoutuser,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword
} = require('../Controllers/usercontroller');

const authMiddleware = require("../Middleware/authMiddleware");

const userRoute = express.Router();


// ================= AUTH ROUTES =================

// ✅ Register
userRoute.post("/register", adduser);

// ✅ Login
userRoute.post("/login", loginuser);

// ✅ Logout
userRoute.post("/logout", logoutuser);


// ================= OTP (EMAIL VERIFICATION) =================

// Send OTP
userRoute.post("/send-otp", sendOtp);

// Verify OTP
userRoute.post("/verify-otp", verifyOtp);


// ================= PASSWORD RESET =================

// Send reset OTP
userRoute.post("/forgot-password", forgotPassword);

// Reset password
userRoute.post("/reset-password", resetPassword);


// ================= PROTECTED ROUTES =================

// Get all users (protected)
userRoute.get("/getuser", authMiddleware, getuser);

// Get profile
userRoute.get("/profile", authMiddleware, getProfile);


module.exports = userRoute;