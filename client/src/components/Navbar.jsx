import { NavLink } from 'react-router-dom'

const quickLinks = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/create', label: 'Create' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Register' },
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
              Campus Pulse
            </p>
            <h2 className="text-xl font-semibold text-white">Student issue board</h2>
          </div>

          <nav className="flex flex-wrap gap-2">
            {quickLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-200'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <p className="text-sm text-slate-300">Real-time student feedback and voting</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Live voting
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
              College portal
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
