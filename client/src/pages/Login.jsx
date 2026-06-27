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
      const token = data?.token || data?.accessToken || data?.jwt || data?.authToken

      if (token) {
        localStorage.setItem('token', token)
        navigate('/')
        return
      }

      if (data?.message) {
        setError(data.message)
        return
      }

      setError('Login failed. No token returned from server.')
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error
      setError(serverMsg || err.message || 'Login failed. Please try again.')
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_-36px_rgba(34,211,238,0.55)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Welcome back</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Sign in to your account</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
          Access the college issue voting platform with your student credentials.
        </p>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_-36px_rgba(34,211,238,0.4)] sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-300">
            <span className="mb-2 block">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            <span className="mb-2 block">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              required
            />
          </label>

          {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  )
}
