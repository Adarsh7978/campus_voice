import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const VALID_BRANCH_CODES = ["CS", "CD", "IT", "AL", "EC", "EX", "ME", "CE", "CB", "AU"];
const COLLEGE_EMAIL_REGEX = /^[a-z0-9._%+-]+@oriental\.ac\.in$/;

// Look for a valid branch code inside the email local part.
// Example: 123CS456@oriental.ac.in will extract CS.
function extractBranchFromEmail(email) {
  const localPart = email.split("@")[0];
  const branchMatch = localPart.match(new RegExp(`(${VALID_BRANCH_CODES.join("|")})`, "i"));
  return branchMatch ? branchMatch[0].toUpperCase() : null;
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

    // Create a new user record.
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
      branch,
    });

    // Send back safe user details without the password.
    return res.status(201).json({
      message: "User registered successfully",
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
