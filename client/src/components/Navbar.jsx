import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="app-header">
      <div className="brand">College Issue Voting</div>
      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/create">Create Issue</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </nav>
    </header>
  )
}
