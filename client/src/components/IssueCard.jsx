export default function IssueCard({ issue, onVote }) {
  const votes = issue.votes ?? issue.voteCount ?? 0

  return (
    <article className="issue-card">
      <div className="issue-card-header">
        <h3>{issue.title}</h3>
        <span className="vote-count">{votes} votes</span>
      </div>
      <p>{issue.description}</p>
      <button type="button" onClick={() => onVote(issue.id || issue._id)}>
        Vote
      </button>
    </article>
  )
}
