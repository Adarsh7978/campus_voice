import Issue from "../models/issue.js";
import cloudinary from "../config/cloudinary.js";
import stream from "stream";

// Helper: upload a file buffer to Cloudinary and return the secure URL.
// Uploads to a folder named "college-issues" for organisation.
async function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    // Create a readable stream from the buffer so we can pipe it to Cloudinary.
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    // Create an upload stream to Cloudinary.
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "college-issues",         // Organise uploads in a dedicated folder.
        resource_type: "image",           // Tell Cloudinary this is an image.
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);       // Return the HTTPS URL of the uploaded image.
      }
    );

    bufferStream.pipe(uploadStream);
  });
}

// Controller to create a new issue.
// Accepts multipart/form-data with fields: title, description, category + optional file "image".
export async function createIssue(req, res) {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    // If a file was uploaded (via multer), upload it to Cloudinary and get the URL.
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      createdBy: req.user.id,
      imageUrl, // Will be null if no image was provided.
    });

    return res.status(201).json(issue);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Controller to upvote an existing issue.
export async function upvoteIssue(req, res) {
  try {
    const issueId = req.params.id;
    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const userId = req.user.id;
    const alreadyVoted = issue.votedBy.some((voterId) => voterId.toString() === userId);
    if (alreadyVoted) {
      return res.status(400).json({ message: "You have already voted for this issue" });
    }

    issue.votes += 1;
    issue.votedBy.push(userId);
    await issue.save();

    return res.json(issue);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Controller to update issue status. Admin only.
export async function updateIssueStatus(req, res) {
  try {
    const issueId = req.params.id;
    const { status } = req.body;
    const allowedStatuses = ["Pending", "In Progress", "Solved"];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Status is required and must be one of: Pending, In Progress, Solved",
      });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    issue.status = status;
    await issue.save();

    return res.json(issue);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Controller to return one issue by ID.
export async function getIssueById(req, res) {
  try {
    const issueId = req.params.id;
    const issue = await Issue.findById(issueId).populate("createdBy", "name email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    return res.json(issue);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Controller to delete an issue. Admin only.
export async function deleteIssue(req, res) {
  try {
    const issueId = req.params.id;
    const issue = await Issue.findByIdAndDelete(issueId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    return res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

// Controller to fetch all issues.
export async function getAllIssues(req, res) {
  try {
    const issues = await Issue.find()
      .sort({ votes: -1 })
      .populate("createdBy", "name email");

    return res.json(issues);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
