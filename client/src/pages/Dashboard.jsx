import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIssues, voteIssue } from '../services/api'
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
      const updatedIssue = await voteIssue(issueId)
      setIssues((current) =>
        current.map((issue) => (issue.id === issueId || issue._id === issueId ? updatedIssue : issue)),
      )
    } catch (error) {
      setError('Unable to submit your vote right now.')
    }
  }

  return (
    <section className="page dashboard-page">
      <div className="page-header">
        <div>
          <h2>Dashboard</h2>
          <p>Browse issues and cast your vote for the best solutions.</p>
        </div>
        <Link to="/create" className="primary-button">
          Create Issue
        </Link>
      </div>

      {loading ? (
        <p>Loading issues...</p>
      ) : (
        <>
          {error && <p className="form-error">{error}</p>}
          {issues.length === 0 ? (
            <p>No issues found yet. Add a new issue to get started.</p>
          ) : (
            <div className="issue-grid">
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
