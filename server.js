import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "./config/db.js";
import User from "./models/user.js";
import Issue from "./models/issue.js";
import auth from "./middleware/auth.js";
import admin from "./middleware/admin.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

// Register route for new users
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Make sure all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if the user already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with that email" });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user record and store it in MongoDB
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return a success response (do not return the raw password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route for existing users
// Accepts `email` and `password`, verifies credentials,
// and returns a signed JWT plus basic user details.
app.post("/login", async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Basic validation - ensure both fields are present
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user by email in the database
    const user = await User.findOne({ email });
    if (!user) {
      // If user not found, credentials are invalid
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password stored
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If passwords don't match, return unauthorized
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT payload. Keep it small — only include necessary info.
    const payload = {
      id: user._id,
      role: user.role,
    };

    // Sign the token. Make sure to set `JWT_SECRET` in your `.env` file.
    const token = jwt.sign(payload, process.env.JWT_SECRET || "devsecret", {
      expiresIn: "1d", // token expires in 1 day
    });

    // Return the token and non-sensitive user details
    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    // On server error, return 500 and the error message
    return res.status(500).json({ message: error.message });
  }
});

// Create Issue route - protected with auth middleware.
// The logged-in user is available on req.user from the auth middleware.
app.post("/issues", auth, async (req, res) => {
  try {
    // Read the fields from the request body.
    const { title, description, category } = req.body;

    // Make sure the request contains all required fields.
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    // Create the issue. `createdBy` is set from the authenticated user ID.
    const issue = await Issue.create({
      title,
      description,
      category,
      createdBy: req.user.id,
      // votes and status use schema defaults: 0 and Pending.
    });

    // Return the newly created issue to the client.
    return res.status(201).json(issue);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Upvote an issue route - protected with auth middleware.
// Uses the issue ID from the URL and the logged-in user from req.user.
app.post("/issues/:id/upvote", auth, async (req, res) => {
  try {
    // Grab the issue ID from the URL parameter.
    const issueId = req.params.id;

    // Try to find the issue by its ID.
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check if the logged-in user already voted for this issue.
    const userId = req.user.id;
    const alreadyVoted = issue.votedBy.some((voterId) => voterId.toString() === userId);
    if (alreadyVoted) {
      return res.status(400).json({ message: "You have already voted for this issue" });
    }

    // Increment the vote count and add the user to the votedBy list.
    issue.votes += 1;
    issue.votedBy.push(userId);

    // Save the updated issue back to the database.
    await issue.save();

    // Return the updated issue data.
    return res.json(issue);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Admin-only route to update issue status.
// This route requires both auth and admin middleware.
app.patch("/issues/:id/status", auth, admin, async (req, res) => {
  try {
    // Read the issue ID from the URL parameter.
    const issueId = req.params.id;
    // Read the new status from the request body.
    const { status } = req.body;

    // Validate the status field.
    const allowedStatuses = ["Pending", "In Progress", "Solved"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status is required and must be one of: Pending, In Progress, Solved",
      });
    }

    // Look up the issue by ID.
    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Update the issue status and save.
    issue.status = status;
    await issue.save();

    // Return the updated issue to the client.
    return res.json(issue);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all issues route.
// This returns all issues sorted by votes in descending order.
app.get("/issues", async (req, res) => {
  try {
    // Find all issues, sort by votes descending, and populate the creator's name and email.
    const issues = await Issue.find()
      .sort({ votes: -1 })
      .populate("createdBy", "name email");

    // Send the list of all issues back to the client.
    return res.json(issues);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("College Issue Platform API Running");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
