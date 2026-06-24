import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const data = await login({ email, password })

      // Try common token fields returned by backends
      const token = data?.token || data?.accessToken || data?.jwt || data?.authToken

      if (token) {
        localStorage.setItem('token', token)
        navigate('/')
        return
      }

      // If backend provided a message, show it
      if (data?.message) {
        setError(data.message)
        return
      }

      setError('Login failed. No token returned from server.')
    } catch (err) {
      // Surface backend error messages when available
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error
      setError(serverMsg || err.message || 'Login failed. Please try again.')
    }
  }

  return (
    <section className="page auth-page">
      <h2>Login</h2>
      <p>Access the college issue voting platform.</p>
      <form onSubmit={handleSubmit} className="form-card">
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

        <button type="submit">Login</button>
      </form>
    </section>
  )
}
