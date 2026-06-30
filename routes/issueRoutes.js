import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import upload from "../middleware/upload.js";
import {
  createIssue,
  upvoteIssue,
  updateIssueStatus,
  getIssueById,
  deleteIssue,
  getAllIssues,
} from "../controllers/issueController.js";

const router = express.Router();

// Issue routes for creating, voting, updating, reading, and deleting issues.
// The "upload.single("image")" middleware processes the image file from the form
// before passing control to the createIssue controller.
router.post("/issues", auth, upload.single("image"), createIssue);
router.post("/issues/:id/upvote", auth, upvoteIssue);
router.patch("/issues/:id/status", auth, admin, updateIssueStatus);
router.get("/issues", getAllIssues);
router.get("/issues/:id", getIssueById);
router.delete("/issues/:id", auth, admin, deleteIssue);

export default router;
