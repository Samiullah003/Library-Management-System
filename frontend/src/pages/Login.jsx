import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { BookOpen, Check, Loader, Mail, Lock, User, GraduationCap, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register, isAuthenticated, isLibrarian } = useAuth()

  const [mode, setMode] = useState(params.get('mode') === 'register' ? 'register' : 'login')
  const [form, setForm] = useState({ name: '', email: '', password: '', department: 'Computer Engineering' })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const redirectTo = location.state?.from || null

  useEffect(() => {
    if (isAuthenticated && !busy) {
      navigate(redirectTo || (isLibrarian ? '/my-books' : '/my-books'), { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLibrarian, busy])

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (mode === 'login') await login(form.email, form.password)
      else await register(form)
      navigate(redirectTo || '/my-books', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const fillDemo = (email, password) => {
    setMode('login')
    setForm((f) => ({ ...f, email, password }))
    setError('')
  }

  return (
    <div className="auth-wrap">
      <aside className="auth-side">
        <img src="/images/shelves.jpg" alt="Library shelves" />
        <div className="auth-side-content">
          <span className="eyebrow" style={{ color: '#e3c07d' }}>Membership</span>
          <h2 style={{ marginTop: 14 }}>One card. Fifteen books. No database.</h2>
          <p>
            Sign in with a demo member account or register a new membership — the servlet stores
            everything in memory and keeps you signed in with a standard JSESSIONID cookie.
          </p>
          <ul>
            <li><Check size={16} /> Borrow up to five copies at a time</li>
            <li><Check size={16} /> Renew each loan twice, 14 days per renewal</li>
            <li><Check size={16} /> Track due dates and reading history</li>
            <li><Check size={16} /> Librarian accounts can add new titles</li>
          </ul>
        </div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <Link to="/" className="row gap-2 muted" style={{ fontSize: 13, marginBottom: 22 }}>
            <BookOpen size={15} /> MU Central Library
          </Link>

          <h1>{mode === 'login' ? 'Welcome back' : 'Create your membership'}</h1>
          <p className="muted" style={{ fontSize: 14 }}>
            {mode === 'login' ? 'Sign in to borrow and manage your books.' : 'Takes ten seconds. No email verification.'}
          </p>

          <div className="row gap-2" style={{ marginTop: 20 }}>
            <button
              className={`chip ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError('') }}
              type="button"
            >
              Sign in
            </button>
            <button
              className={`chip ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError('') }}
              type="button"
            >
              Register
            </button>
          </div>

          <form onSubmit={submit}>
            {mode === 'register' && (
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" className="input" value={form.name} onChange={set('name')} placeholder="Aarav Kulkarni" required />
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="input" value={form.email} onChange={set('email')} placeholder="you@library.edu" required />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" className="input" value={form.password} onChange={set('password')} placeholder="At least 6 characters" required />
            </div>

            {mode === 'register' && (
              <div className="field">
                <label htmlFor="department">Department</label>
                <select id="department" className="select" value={form.department} onChange={set('department')}>
                  <option>Computer Engineering</option>
                  <option>Information Technology</option>
                  <option>Electronics &amp; Telecommunication</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                  <option>Humanities &amp; Sciences</option>
                </select>
              </div>
            )}

            {error && <div className="notice notice-err"><span>{error}</span></div>}

            <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
              {busy ? <Loader size={15} className="spinner" style={{ border: 'none', animation: 'spin .9s linear infinite' }} /> : null}
              {mode === 'login' ? 'Sign in' : 'Create membership'}
              {!busy && <ArrowRight size={15} />}
            </button>
          </form>

          <div className="demo-box">
            <strong>Demo accounts</strong>
            <div style={{ display: 'grid', gap: 8 }}>
              <button
                type="button"
                onClick={() => fillDemo('priya@library.edu', 'priya123')}
                className="row gap-2"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', color: '#5c4a23', fontSize: 12.5 }}
              >
                <GraduationCap size={13} /> Student — <code>priya@library.edu</code> / <code>priya123</code>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('librarian@library.edu', 'admin123')}
                className="row gap-2"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', color: '#5c4a23', fontSize: 12.5 }}
              >
                <Lock size={13} /> Librarian — <code>librarian@library.edu</code> / <code>admin123</code>
              </button>
              <button
                type="button"
                onClick={() => fillDemo('rohan@library.edu', 'rohan123')}
                className="row gap-2"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', color: '#5c4a23', fontSize: 12.5 }}
              >
                <User size={13} /> Student — <code>rohan@library.edu</code> / <code>rohan123</code>
              </button>
            </div>
          </div>

          <p className="muted" style={{ fontSize: 12, marginTop: 18 }}>
            <Mail size={12} style={{ verticalAlign: '-2px' }} /> Credentials are checked against BCrypt hashes on the server.
          </p>
        </div>
      </main>
    </div>
  )
}
