import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await register({ name, email, password })
      navigate('/')
    } catch (error) {
      setError('Registration failed. Please try again with a different email.')
    }
  }

  return (
    <section className="page auth-page">
      <h2>Register</h2>
      <p>Create a new account to vote on issues.</p>
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

        <button type="submit">Register</button>
      </form>
    </section>
  )
}
