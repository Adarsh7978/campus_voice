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
      const msg = data?.message || 'Registration successful.'
      setSuccess(msg)
      setTimeout(() => navigate('/login'), 1400)
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error
      setError(serverMsg || err.message || 'Registration failed. Please try again with a different email.')
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_-36px_rgba(34,211,238,0.55)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Join the community</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Create your student account</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
          Use your official college email to register and start participating in the issue voting platform.
        </p>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_-36px_rgba(34,211,238,0.4)] sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-300">
            <span className="mb-2 block">Full name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              required
            />
          </label>

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
          {success && <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</p>}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm leading-7 text-slate-400">
          Google OAuth login will be added later, so this page currently uses college email/password registration only.
        </p>
      </div>
    </section>
  )
}
