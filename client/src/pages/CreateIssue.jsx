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
    <section className="space-y-6">
      <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_-36px_rgba(34,211,238,0.55)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Student submissions</p>
        <h2 className="mt-2 text-3xl font-semibold text-white">Share a campus concern</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Post a new issue for the college community to review and support.
        </p>
      </div>

      <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-6 shadow-[0_24px_80px_-36px_rgba(34,211,238,0.4)] sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm font-medium text-slate-300">
            <span className="mb-2 block">Issue title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            <span className="mb-2 block">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="5"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-300">
            <span className="mb-2 block">Category</span>
            <input
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g. Campus Facilities"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
              required
            />
          </label>

          {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}

          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Create issue
          </button>
        </form>
      </div>
    </section>
  )
}
