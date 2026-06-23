import express from "express";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
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
router.post("/issues", auth, createIssue);
router.post("/issues/:id/upvote", auth, upvoteIssue);
router.patch("/issues/:id/status", auth, admin, updateIssueStatus);
router.get("/issues", getAllIssues);
router.get("/issues/:id", getIssueById);
router.delete("/issues/:id", auth, admin, deleteIssue);

export default router;
