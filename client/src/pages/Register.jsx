import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const data = await register({ name, email, password })

      // If backend returned a message, show it as success
      const msg = data?.message || 'Registration successful.'
      setSuccess(msg)

      // Redirect to login after a short delay to let the user read the success message
      setTimeout(() => navigate('/login'), 1400)
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error
      setError(serverMsg || err.message || 'Registration failed. Please try again with a different email.')
    }
  }

  return (
    <section className="page auth-page">
      <h2>Register</h2>
      <p>Use your official @oriental.ac.in college email. Your branch code is taken automatically from the roll number in the email.</p>
      <form onSubmit={handleSubmit} className="form-card">
        <label>
          Full name
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit">Register</button>
      </form>
      <p className="form-note" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        Google OAuth login will be added later, so this page currently uses college email/password registration only.
      </p>
    </section>
  )
}
