import express from "express";
import { register, login, verifyOtp, resendOtp } from "../controllers/authController.js";

const router = express.Router();

// Authentication routes for registration, login, OTP verification, and OTP resend.
router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

export default router;
