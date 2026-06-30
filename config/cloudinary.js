// Cloudinary SDK setup
// ======================
// This file configures the Cloudinary SDK using credentials from your .env file.
// Cloudinary is a cloud-based image and video management service.
// We use it to store uploaded issue images and get back a URL to save in MongoDB.

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your account credentials.
// Get these values from your Cloudinary dashboard (https://cloudinary.com/console).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
