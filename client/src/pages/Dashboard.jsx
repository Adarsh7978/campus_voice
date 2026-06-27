import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIssues, upvoteIssue } from '../services/api'
import IssueCard from '../components/IssueCard'

export default function Dashboard() {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await getIssues()
        setIssues(data)
      } catch (error) {
        setError('Unable to load issues. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadIssues()
  }, [])

  const handleVote = async (issueId) => {
    try {
      const updatedIssue = await upvoteIssue(issueId)
      setIssues((current) =>
        current.map((issue) => (issue.id === issueId || issue._id === issueId ? updatedIssue : issue)),
      )
    } catch (error) {
      setError('Unable to submit your vote right now.')
    }
  }

  const totalVotes = issues.reduce((sum, issue) => sum + (issue.votes ?? issue.voteCount ?? 0), 0)
  const activeCount = issues.length
  const trendingCount = issues.filter((issue) => (issue.votes ?? issue.voteCount ?? 0) > 10).length

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_-36px_rgba(34,211,238,0.55)] sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
              College issue board
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Shape the campus experience together.
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              Review student concerns, support the ideas that matter most, and help the college act faster.
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            + New issue
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Open issues</p>
            <p className="mt-2 text-2xl font-semibold text-white">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Total votes</p>
            <p className="mt-2 text-2xl font-semibold text-white">{totalVotes}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Trending</p>
            <p className="mt-2 text-2xl font-semibold text-white">{trendingCount}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-8 text-center text-slate-300">
          Loading issues...
        </div>
      ) : (
        <>
          {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
          {issues.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-900/60 p-8 text-center text-slate-300">
              No issues found yet. Add a new issue to get started.
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {issues.map((issue) => (
                <IssueCard key={issue.id || issue._id} issue={issue} onVote={handleVote} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
