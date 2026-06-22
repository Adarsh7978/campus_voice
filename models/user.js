import mongoose from "mongoose";

// Define a User schema for the college issue voting platform.
// This schema stores the basic user information needed for login and roles.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "moderator"],
      default: "student",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields.
  }
);

// Create the User model from the schema.
const User = mongoose.model("User", userSchema);

export default User;
