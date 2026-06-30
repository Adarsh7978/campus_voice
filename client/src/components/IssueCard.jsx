export default function IssueCard({ issue, onVote }) {
  const votes = issue.votes ?? issue.voteCount ?? 0;

  const status =
    votes > 18 ? "Trending" : votes > 8 ? "Active" : "Fresh";

  const statusStyles = {
    Trending: "bg-rose-50 text-rose-700 border-rose-200",
    Active: "bg-amber-50 text-amber-700 border-amber-200",
    Fresh: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <article className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            {issue.category || "Campus issue"}
          </p>
          <h3 className="mt-1 truncate text-lg font-semibold text-gray-900">
            {issue.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>
      </div>

      {issue.imageUrl && (
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-100">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="h-48 w-full object-cover"
          />
        </div>
      )}

      <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600">
        {issue.description}
      </p>

      <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Support
          </p>
          <p className="mt-0.5 text-lg font-semibold text-gray-900">
            {votes} votes
          </p>
        </div>
        <button
          type="button"
          onClick={() => onVote(issue.id || issue._id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M10 3.5a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4.25A.75.75 0 0 1 10 3.5Z" />
          </svg>
          Vote
        </button>
      </div>
    </article>
  );
}
