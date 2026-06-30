// Multer middleware for handling image uploads
// =============================================
// Multer processes multipart/form-data (i.e. file uploads from a form).
// We configure it to:
//   - Accept only jpg, jpeg, png files.
//   - Reject any file larger than 5 MB.
//   - Store files temporarily in memory (buffer) so we can forward them to Cloudinary.
//   - Use a helper "upload" that expects a field named "image" in the form.

import multer from "multer";

// Allowed image MIME types
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg"];

// Maximum file size: 5 MB (in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Store file in memory so we can read the buffer and upload to Cloudinary.
const storage = multer.memoryStorage();

// File filter: allow only images with the MIME types listed above.
function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    // Reject with a descriptive error message
    cb(new Error("Only .jpg, .jpeg, and .png files are allowed."), false);
  }
}

// Create the configured multer instance.
// `upload.single("image")` will extract a single file from the `image` field of the form.
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
});

export default upload;
