// Cloudinary SDK setup
// ======================
// This file configures the Cloudinary SDK using credentials from your .env file.
// Cloudinary is a cloud-based image and video management service.
// We use it to store uploaded issue images and get back a URL to save in MongoDB.

import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

// Ensure environment variables are loaded before Cloudinary is configured.
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
