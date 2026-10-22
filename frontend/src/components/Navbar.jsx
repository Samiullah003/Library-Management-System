import { Link, NavLink, useNavigate } from 'react-router-dom'
import { BookOpen, LogOut, Search, User, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/catalog', label: 'Catalogue' },
  { to: '/my-books', label: 'My Books' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const { user, isLibrarian, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setOpen(false)
    navigate('/')
  }

  return (
    <>
      <div className="topbar">
        <div className="shell-wide">
          <span><i className="dot" /> Central Library open · Mon–Sat, 8:00 AM – 10:00 PM</span>
          <span>Issue period 14 days · 2 renewals per copy</span>
        </div>
      </div>

      <header className="nav">
        <div className="shell-wide nav-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-mark"><BookOpen size={21} strokeWidth={2} /></span>
            <span className="brand-text">
              <strong>MU Central Library</strong>
              <small>Library Management System</small>
            </span>
          </Link>

          <nav className="nav-links">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
            {isLibrarian && (
              <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Add Book
              </NavLink>
            )}
          </nav>

          <div className="nav-actions">
            <Link to="/catalog" className="btn btn-quiet btn-sm" aria-label="Search catalogue">
              <Search size={15} /> <span style={{ display: 'inline' }}>Search</span>
            </Link>
            {user ? (
              <>
                <span className="pill pill-brass" title={user.email}>
                  <User size={13} /> {user.name.split(' ')[0]}
                </span>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign in</Link>
                <Link to="/login?mode=register" className="btn btn-primary btn-sm">
                  Join the library
                </Link>
              </>
            )}
            <button
              className="btn btn-quiet btn-sm"
              style={{ display: 'none' }}
              id="mobile-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div style={{ background: '#fff', borderBottom: '1px solid var(--line)', padding: '12px 20px' }}>
          {[...links, ...(isLibrarian ? [{ to: '/admin', label: 'Add Book' }] : [])].map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 4px', fontSize: 14 }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
