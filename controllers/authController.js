import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/user.js";

const VALID_BRANCH_CODES = ["CS", "CD", "IT", "AL", "EC", "EX", "ME", "CE", "CB", "AU"];
const COLLEGE_EMAIL_REGEX = /^[a-z0-9._%+-]+@oriental\.ac\.in$/;
const OTP_EXPIRY_MINUTES = 10;

// Look for a valid branch code inside the email local part.
// Example: 123CS456@oriental.ac.in will extract CS.
function extractBranchFromEmail(email) {
  const localPart = email.split("@")[0];
  const branchMatch = localPart.match(new RegExp(`(${VALID_BRANCH_CODES.join("|")})`, "i"));
  return branchMatch ? branchMatch[0].toUpperCase() : null;
}

// Create a 6-digit OTP for email verification.
export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Check whether a saved OTP has expired.
export function isOtpExpired(expiryDate) {
  if (!expiryDate) return true;
  return new Date() > new Date(expiryDate);
}

// Create an email transporter only when SMTP details are provided.
function createTransporter() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: Number(EMAIL_PORT) === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

// Send the OTP to the user's college email.
async function sendOtpEmail(toEmail, otp) {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("Email OTP service is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS to send verification emails.");
    return { sent: false };
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: toEmail,
    subject: "College Issue Platform - OTP Verification",
    text: `Your 6-digit OTP is ${otp}. It expires in 10 minutes.`,
  });

  return { sent: true };
}

// Save a fresh OTP for a user and set the expiry time.
async function saveOtpForUser(user, otp) {
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  user.isVerified = false;
  await user.save();
}

// Clear the OTP after successful verification.
async function clearOtpForUser(user) {
  user.otp = null;
  user.otpExpiry = null;
  user.isVerified = true;
  await user.save();
}

// Controller for user registration logic.
// Only official college email IDs are accepted and the branch code is extracted from the roll number.
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    // Basic required field validation.
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, college email, and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(name).trim();

    // Validate the official college email domain.
    if (!COLLEGE_EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid college email format. Use an @oriental.ac.in email address." });
    }

    // Extract branch code from the local part of the email address.
    const branch = extractBranchFromEmail(normalizedEmail);
    if (!branch) {
      return res.status(400).json({
        message: `Invalid roll number in college email. Your email must include one of these branch codes: ${VALID_BRANCH_CODES.join(", ")}.`,
      });
    }

    // Ensure the email is not already in use.
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "A user already exists with that college email." });
    }

    // Hash the user's password before saving.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user record and give it a fresh OTP.
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      branch,
      isVerified: false,
    });

    const otp = generateOtp();
    await saveOtpForUser(user, otp);

    // Try to deliver the OTP using email. If SMTP is not configured, the server will log a warning.
    await sendOtpEmail(normalizedEmail, otp);

    // Send back safe user details without the password.
    return res.status(201).json({
      message: "Registration successful. Please verify the OTP sent to your college email.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Controller for email OTP verification.
export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "This account is already verified." });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "No OTP found. Please request a new one." });
    }

    if (isOtpExpired(user.otpExpiry)) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });
    }

    await clearOtpForUser(user);

    return res.json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Resend a fresh OTP to the user's email.
export async function resendOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "This account is already verified." });
    }

    const otp = generateOtp();
    await saveOtpForUser(user, otp);
    await sendOtpEmail(normalizedEmail, otp);

    return res.json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Controller for login logic.
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Need both fields to continue.
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Find the user by normalized email.
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare entered password with the stored hashed password.
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    // Build token payload with only needed info.
    const payload = {
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "devsecret", {
      expiresIn: "1d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
