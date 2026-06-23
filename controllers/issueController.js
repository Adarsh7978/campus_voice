import Issue from "../models/issue.js";

// Controller to create a new issue.
export async function createIssue(req, res) {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      createdBy: req.user.id,
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
