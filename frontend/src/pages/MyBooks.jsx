import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BookOpen, RefreshCw, Undo2, AlertTriangle, User, Mail, IdCard, CalendarDays } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

function daysLeft(dueOn) {
  const due = new Date(dueOn + 'T23:59:59')
  return Math.ceil((due - new Date()) / 86400000)
}

export default function MyBooks() {
  const { user, isAuthenticated, isLibrarian, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    api
      .getLoans()
      .then(setLoans)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/my-books' } })
      return
    }
    load()
  }, [authLoading, isAuthenticated, navigate, load])

  const act = async (loan, kind) => {
    setBusyId(loan.id)
    setMessage('')
    try {
      if (kind === 'return') await api.returnLoan(loan.id)
      else await api.renewLoan(loan.id)
      setMessage(kind === 'return' ? 'Book returned to the shelf.' : 'Renewed for another 14 days.')
      load()
    } catch (e) {
      setMessage(e.message)
    } finally {
      setBusyId(null)
    }
  }

  const active = loans.filter((l) => l.status === 'ISSUED')
  const history = loans.filter((l) => l.status === 'RETURNED')
  const overdue = active.filter((l) => daysLeft(l.dueOn) < 0)

  if (!authLoading && !isAuthenticated) return null

  return (
    <>
      <section className="hero-mini">
        <div className="shell">
          <span className="eyebrow" style={{ color: '#e3c07d' }}>My account</span>
          <h1>{isLibrarian ? 'Circulation desk' : 'My borrowed books'}</h1>
          <p>
            {isLibrarian
              ? 'Every loan in the library, with due dates and overdue flags.'
              : 'Everything you currently have on loan, plus your reading history.'}
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell">
          <div className="panel panel-pad" style={{ marginTop: -58, position: 'relative', zIndex: 2 }}>
            <div className="spread wrap">
              <div className="row gap-4">
                <span className="brand-mark" style={{ width: 52, height: 52 }}>
                  <User size={22} />
                </span>
                <div>
                  <h3 style={{ fontSize: 22 }}>{user?.name}</h3>
                  <div className="row gap-4 wrap muted" style={{ fontSize: 12.5, marginTop: 4 }}>
                    <span className="row gap-2"><Mail size={12} /> {user?.email}</span>
                    <span className="row gap-2"><IdCard size={12} /> {user?.memberId}</span>
                    <span className="row gap-2"><CalendarDays size={12} /> Joined {user?.joinedOn}</span>
                  </div>
                </div>
              </div>
              <div className="row gap-3">
                <span className="pill pill-brass">{user?.role}</span>
                <span className="pill pill-soft">{user?.department}</span>
              </div>
            </div>

            <div className="stats-grid" style={{ marginTop: 24, borderTop: '1px solid var(--line)', paddingTop: 20 }}>
              <div className="stat" style={{ padding: '10px 18px 0 0' }}>
                <strong style={{ fontSize: 28 }}>{active.length}</strong><span>On loan</span>
              </div>
              <div className="stat" style={{ padding: '10px 18px 0 18px' }}>
                <strong style={{ fontSize: 28 }}>{overdue.length}</strong><span>Overdue</span>
              </div>
              <div className="stat" style={{ padding: '10px 18px 0 18px' }}>
                <strong style={{ fontSize: 28 }}>{history.length}</strong><span>Returned</span>
              </div>
              <div className="stat" style={{ padding: '10px 0 0 18px', borderRight: 'none' }}>
                <strong style={{ fontSize: 28 }}>14</strong><span>Day loan period</span>
              </div>
            </div>
          </div>

          {message && <div className="notice notice-ok" style={{ marginTop: 20 }}>{message}</div>}
          {error && <div className="notice notice-err" style={{ marginTop: 20 }}>{error}</div>}

          <div className="spread" style={{ margin: '38px 0 18px' }}>
            <h2 style={{ fontSize: 24 }}>Currently issued</h2>
            <button className="btn btn-ghost btn-sm" onClick={load}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="stack gap-3">
              {[0, 1].map((i) => <div key={i} className="skeleton" style={{ height: 176 }} />)}
            </div>
          ) : active.length === 0 ? (
            <div className="panel empty">
              <div className="icon-wrap"><BookOpen size={26} /></div>
              <h3>No books on loan</h3>
              <p>Browse the catalogue and borrow a copy — it will appear here with its due date.</p>
              <Link to="/catalog" className="btn btn-primary btn-sm" style={{ marginTop: 20 }}>
                Find something to read
              </Link>
            </div>
          ) : (
            <div className="stack gap-3">
              {active.map((loan) => {
                const left = daysLeft(loan.dueOn)
                const late = left < 0
                return (
                  <div key={loan.id} className="panel loan-card">
                    <img src={loan.coverUrl || '/covers/placeholder.svg'} alt={`Cover of ${loan.bookTitle}`} />
                    <div>
                      <div className="row gap-2 wrap">
                        <h3 style={{ fontSize: 18 }}>{loan.bookTitle}</h3>
                        {late
                          ? <span className="pill pill-out"><AlertTriangle size={11} /> Overdue</span>
                          : <span className="pill pill-ok">On time</span>}
                      </div>
                      <p className="muted" style={{ fontSize: 13, margin: '4px 0 0' }}>{loan.bookAuthor}</p>
                      <div className="loan-meta">
                        <span>Borrowed<strong>{loan.borrowedOn}</strong></span>
                        <span>Due<strong style={{ color: late ? 'var(--rust)' : undefined }}>{loan.dueOn}</strong></span>
                        <span>Status<strong>{late ? `${Math.abs(left)} days late` : `${left} days left`}</strong></span>
                        <span>Renewals<strong>{loan.renewals} of 2</strong></span>
                        {isLibrarian && <span>Member<strong>{loan.memberName}</strong></span>}
                      </div>
                    </div>
                    <div className="loan-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => act(loan, 'return')}
                        disabled={busyId === loan.id}
                      >
                        <Undo2 size={14} /> Return
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => act(loan, 'renew')}
                        disabled={busyId === loan.id || loan.renewals >= 2}
                      >
                        <RefreshCw size={14} /> Renew
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {history.length > 0 && (
            <>
              <h2 style={{ fontSize: 22, margin: '46px 0 16px' }}>Reading history</h2>
              <div className="panel table-wrap">
                <table className="data">
                  <thead>
                    <tr>
                      <th>Title</th><th>Borrowed</th><th>Due</th><th>Returned</th><th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((l) => (
                      <tr key={l.id}>
                        <td>
                          <strong style={{ fontSize: 13.5 }}>{l.bookTitle}</strong>
                          <div className="muted" style={{ fontSize: 11.5 }}>{l.bookAuthor}</div>
                        </td>
                        <td>{l.borrowedOn}</td>
                        <td>{l.dueOn}</td>
                        <td>{l.returnedOn}</td>
                        <td><span className="pill pill-soft">Returned</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
