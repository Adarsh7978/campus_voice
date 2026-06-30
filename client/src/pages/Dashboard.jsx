import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getIssues, upvoteIssue } from "../services/api";
import IssueCard from "../components/IssueCard";

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await getIssues();
        setIssues(data);
      } catch {
        setError("Unable to load issues. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  const handleVote = async (issueId) => {
    try {
      const updatedIssue = await upvoteIssue(issueId);
      setIssues((current) =>
        current.map((issue) =>
          issue.id === issueId || issue._id === issueId ? updatedIssue : issue
        )
      );
    } catch {
      setError("Unable to submit your vote right now.");
    }
  };

  const totalVotes = issues.reduce(
    (sum, issue) => sum + (issue.votes ?? issue.voteCount ?? 0),
    0
  );
  const activeCount = issues.length;
  const trendingCount = issues.filter(
    (issue) => (issue.votes ?? issue.voteCount ?? 0) > 10
  ).length;

  return (
    <section className="space-y-6">
      {/* Hero section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              College Issue Board
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Shape the campus experience together.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Review student concerns, support the ideas that matter most, and
              help the college act faster.
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            + New Issue
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Open issues</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {activeCount}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Total votes</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {totalVotes}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-500">Trending</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {trendingCount}
            </p>
          </div>
        </div>
      </div>

      {/* Issues list */}
      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
          Loading issues...
        </div>
      ) : (
        <>
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {issues.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 shadow-sm">
              No issues found yet.{" "}
              <Link
                to="/create"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Add a new issue
              </Link>{" "}
              to get started.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {issues.map((issue) => (
                <IssueCard
                  key={issue.id || issue._id}
                  issue={issue}
                  onVote={handleVote}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
