import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PlusCircle, Trash2, ShieldAlert, BookOpen, RefreshCw } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const emptyForm = {
  title: '', author: '', isbn: '', year: 2024, publisher: '',
  category: 'Computer Engineering', description: '', totalCopies: 3, pages: 300,
}

export default function Admin() {
  const { isLibrarian, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(emptyForm)
  const [books, setBooks] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = () => api.getBooks().then(setBooks).catch(() => {})

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) { navigate('/login', { state: { from: '/admin' } }); return }
    load()
  }, [authLoading, isAuthenticated, navigate])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setError(''); setMessage('')
    try {
      await api.addBook({
        ...form,
        year: Number(form.year),
        totalCopies: Number(form.totalCopies),
        pages: Number(form.pages),
        coverUrl: '/covers/placeholder.svg',
      })
      setMessage(`“${form.title}” added to the catalogue.`)
      setForm(emptyForm)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const remove = async (book) => {
    if (!window.confirm(`Remove “${book.title}” from the catalogue?`)) return
    try {
      await api.deleteBook(book.id)
      setMessage(`“${book.title}” removed.`)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!authLoading && !isAuthenticated) return null

  if (!isLibrarian) {
    return (
      <div className="shell section">
        <div className="panel empty">
          <div className="icon-wrap"><ShieldAlert size={26} /></div>
          <h3>Librarian access only</h3>
          <p>This page lets the library staff add and remove titles. Sign in as a librarian to continue.</p>
          <div className="row gap-3" style={{ justifyContent: 'center', marginTop: 20 }}>
            <Link to="/login" className="btn btn-primary btn-sm">Sign in as librarian</Link>
            <Link to="/catalog" className="btn btn-ghost btn-sm">Back to catalogue</Link>
          </div>
          <p className="muted" style={{ fontSize: 12, marginTop: 16 }}>
            Demo: librarian@library.edu / admin123
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <section className="hero-mini">
        <div className="shell">
          <span className="eyebrow" style={{ color: '#e3c07d' }}>Staff tools</span>
          <h1>Catalogue administration</h1>
          <p>Add a new title or retire an old one. Changes live in the servlet's memory for this session.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: 30, alignItems: 'start' }}>
          <div className="panel panel-pad">
            <h2 style={{ fontSize: 22, marginBottom: 6 }}>Add a book</h2>
            <p className="muted" style={{ fontSize: 13.5, marginTop: 0 }}>
              Fields marked with * are required. The API validates on the server too.
            </p>

            <form onSubmit={submit} style={{ display: 'grid', gap: 16, marginTop: 20 }}>
              <div className="field">
                <label htmlFor="title">Title *</label>
                <input id="title" className="input" value={form.title} onChange={set('title')} placeholder="Compilers: Principles, Techniques and Tools" required />
              </div>
              <div className="field">
                <label htmlFor="author">Author(s) *</label>
                <input id="author" className="input" value={form.author} onChange={set('author')} placeholder="Aho, Lam, Sethi & Ullman" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label htmlFor="isbn">ISBN-13</label>
                  <input id="isbn" className="input" value={form.isbn} onChange={set('isbn')} placeholder="9780131103627" />
                </div>
                <div className="field">
                  <label htmlFor="year">Year</label>
                  <input id="year" type="number" className="input" value={form.year} onChange={set('year')} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label htmlFor="publisher">Publisher</label>
                  <input id="publisher" className="input" value={form.publisher} onChange={set('publisher')} placeholder="Pearson" />
                </div>
                <div className="field">
                  <label htmlFor="category">Collection</label>
                  <select id="category" className="select" value={form.category} onChange={set('category')}>
                    <option>Computer Engineering</option>
                    <option>Biography &amp; Inspiration</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label htmlFor="totalCopies">Copies</label>
                  <input id="totalCopies" type="number" min="1" className="input" value={form.totalCopies} onChange={set('totalCopies')} />
                </div>
                <div className="field">
                  <label htmlFor="pages">Pages</label>
                  <input id="pages" type="number" className="input" value={form.pages} onChange={set('pages')} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="description">Description</label>
                <textarea id="description" className="textarea" value={form.description} onChange={set('description')} placeholder="What the book covers and which paper it supports…" />
              </div>

              {message && <div className="notice notice-ok"><span>{message}</span></div>}
              {error && <div className="notice notice-err"><span>{error}</span></div>}

              <button className="btn btn-primary" type="submit" disabled={busy}>
                <PlusCircle size={16} /> {busy ? 'Adding…' : 'Add to catalogue'}
              </button>
            </form>
          </div>

          <div className="panel">
            <div className="spread" style={{ padding: '18px 20px', borderBottom: '1px solid var(--line)' }}>
              <h3 style={{ fontSize: 16 }}><BookOpen size={15} style={{ verticalAlign: '-2px' }} /> {books.length} titles</h3>
              <button className="btn btn-quiet btn-sm" onClick={load}><RefreshCw size={13} /></button>
            </div>
            <div style={{ maxHeight: 560, overflowY: 'auto' }}>
              {books.map((b) => (
                <div key={b.id} className="spread" style={{ padding: '12px 18px', borderBottom: '1px solid #f4eee3', gap: 10 }}>
                  <div style={{ minWidth: 0 }}>
                    <strong style={{ fontSize: 13, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.title}
                    </strong>
                    <span className="muted" style={{ fontSize: 11.5 }}>{b.author}</span>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(b)} aria-label={`Remove ${b.title}`}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
