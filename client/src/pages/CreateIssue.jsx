import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createIssue } from '../services/api'

export default function CreateIssue() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [image, setImage] = useState(null)   // Stores the selected File object
  const [preview, setPreview] = useState('') // Data URL for the image preview (optional)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  // When the user picks a file, store it and create a local preview URL.
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setUploading(true)

    try {
      // Pass all fields plus the File object (if any) to the API service.
      // The API service will automatically switch to FormData when it sees a File.
      await createIssue({ title, description, category, image })
      navigate('/')
    } catch (error) {
      const serverMsg = error?.response?.data?.message
      setError(serverMsg || 'Unable to create the issue. Please try again.')
    } finally {
      setUploading(false)
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

          {/* Image upload field — accepts only jpg, jpeg, png */}
          <label className="block text-sm font-medium text-slate-300">
            <span className="mb-2 block">Image (optional — jpg, jpeg, png only, max 5 MB)</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-400 file:mr-3 file:rounded-full file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-950 hover:file:bg-cyan-400"
            />
          </label>

          {/* Show a small preview of the selected image */}
          {preview && (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <img src={preview} alt="Preview" className="max-h-48 w-full object-cover" />
            </div>
          )}

          {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}

          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Create issue'}
          </button>
        </form>
      </div>
    </section>
  )
}
