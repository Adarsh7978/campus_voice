export default function IssueCard({ issue, onVote }) {
  const votes = issue.votes ?? issue.voteCount ?? 0
  const status = votes > 18 ? 'Trending' : votes > 8 ? 'Active' : 'Fresh'
  const statusStyles =
    status === 'Trending'
      ? 'bg-rose-500/15 text-rose-200'
      : status === 'Active'
        ? 'bg-amber-500/15 text-amber-200'
        : 'bg-emerald-500/15 text-emerald-200'

  return (
    <article className="group flex h-full flex-col rounded-[28px] border border-white/10 bg-slate-900/80 p-5 shadow-[0_24px_80px_-36px_rgba(34,211,238,0.8)] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_24px_90px_-35px_rgba(34,211,238,0.55)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
            {issue.category || 'Campus issue'}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">{issue.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles}`}>
          {status}
        </span>
      </div>

      {/* Show the uploaded image if one exists */}
      {issue.imageUrl && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="h-48 w-full object-cover"
          />
        </div>
      )}

      <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">{issue.description}</p>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/80 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">
            Support
          </p>
          <p className="mt-1 text-lg font-semibold text-white">{votes} votes</p>
        </div>
        <button
          type="button"
          onClick={() => onVote(issue.id || issue._id)}
          className="inline-flex items-center gap-2 rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20 hover:text-cyan-100"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M10 3.5a.75.75 0 0 1 .75.75v5.25H16a.75.75 0 0 1 0 1.5h-5.25V16a.75.75 0 0 1-1.5 0v-5.25H4a.75.75 0 0 1 0-1.5h5.25V4.25A.75.75 0 0 1 10 3.5Z" />
          </svg>
          Vote
        </button>
      </div>
    </article>
  )
}
