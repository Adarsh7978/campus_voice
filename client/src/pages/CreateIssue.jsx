import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createIssue } from '../services/api'

export default function CreateIssue() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await createIssue({ title, description, category })
      navigate('/')
    } catch (error) {
      const serverMsg = error?.response?.data?.message
      setError(serverMsg || 'Unable to create the issue. Please try again.')
    }
  }

  return (
    <section className="page auth-page">
      <h2>Create Issue</h2>
      <p>Submit a new college problem for voting and discussion.</p>
      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Issue title
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows="5"
            required
          />
        </label>

        <label>
          Category
          <input
            type="text"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="e.g. Campus Facilities"
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit">Create Issue</button>
      </form>
    </section>
  )
}
