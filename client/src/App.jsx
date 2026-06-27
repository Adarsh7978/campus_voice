import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import CreateIssue from './pages/CreateIssue'
import Login from './pages/Login'
import Register from './pages/Register'

const sidebarLinks = [
  { to: '/', label: 'Overview', icon: '◉' },
  { to: '/create', label: 'Create Issue', icon: '+' },
  { to: '/login', label: 'Login', icon: '◌' },
  { to: '/register', label: 'Register', icon: '✦' },
]

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_30%),linear-gradient(135deg,_#020617_0%,_#0f172a_45%,_#111827_100%)] text-slate-100">
        <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
          <aside className="w-full border-b border-white/10 bg-slate-950/80 p-6 backdrop-blur lg:w-72 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-xl text-cyan-300">
                🎓
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">
                  Student Portal
                </p>
                <h1 className="text-lg font-semibold text-white">College Issue Voting</h1>
              </div>
            </div>

            <nav className="mt-8 space-y-2">
              {sidebarLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span className="text-base">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-4">
              <p className="text-sm font-semibold text-cyan-200">Campus feedback, amplified</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Students can highlight issues, vote on priorities, and help the college act faster.
              </p>
            </div>
          </aside>

          <div className="flex-1">
            <Navbar />
            <main className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/create" element={<CreateIssue />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
