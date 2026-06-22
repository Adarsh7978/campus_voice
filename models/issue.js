import mongoose from "mongoose";

// Define the Issue schema for the college issue voting platform.
// This schema stores the issue title, description, category, voting state,
// the user who created it, and automatic timestamps.
const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Solved"],
      default: "Pending",
      trim: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
    votedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
      // Store the IDs of users who have voted on this issue.
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically.
  }
);

// Create the Issue model from the schema.
const Issue = mongoose.model("Issue", issueSchema);

export default Issue;
