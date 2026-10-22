import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Star, BookMarked, Layers, Calendar, Building2, Barcode, FileText, Globe, MapPin, CheckCircle2,
} from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import BookCard from '../components/BookCard'

export default function BookDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [book, setBook] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    api
      .getBook(id)
      .then((data) => {
        if (!alive) return
        setBook(data)
        return api.getBooks({ category: data.category })
      })
      .then((list) => {
        if (alive && list) setRelated(list.filter((b) => String(b.id) !== String(id)).slice(0, 4))
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [id])

  const borrow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/book/${id}` } })
      return
    }
    setBusy(true)
    setMessage('')
    try {
      const loan = await api.borrowBook(book.id)
      setMessage(`Issued successfully. Please return by ${loan.dueOn}.`)
      setBook(await api.getBook(id))
    } catch (e) {
      setMessage(e.message)
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="shell section">
        <div className="detail-grid">
          <div className="skeleton" style={{ aspectRatio: '2 / 3' }} />
          <div style={{ display: 'grid', gap: 14 }}>
            <div className="skeleton" style={{ height: 14, width: '30%' }} />
            <div className="skeleton" style={{ height: 40, width: '80%' }} />
            <div className="skeleton" style={{ height: 18, width: '45%' }} />
            <div className="skeleton" style={{ height: 120, marginTop: 20 }} />
          </div>
        </div>
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="shell section">
        <div className="panel empty">
          <h3>Book not found</h3>
          <p>{error || 'That catalogue number does not exist.'}</p>
          <Link to="/catalog" className="btn btn-primary btn-sm" style={{ marginTop: 20 }}>
            Back to the catalogue
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="section-tight">
      <div className="shell">
        <div className="crumb">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/catalog">Catalogue</Link> <span>/</span>
          <span style={{ color: 'var(--ink)' }}>{book.title}</span>
        </div>

        <div className="detail-grid" style={{ marginTop: 28 }}>
          <div>
            <div className="detail-cover">
              <img src={book.coverUrl} alt={`Cover of ${book.title}`} />
            </div>
            <div className="panel panel-pad" style={{ marginTop: 22, padding: 20 }}>
              <div className="spread" style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  Shelf status
                </span>
                {book.availableCopies > 0
                  ? <span className="pill pill-ok">Available</span>
                  : <span className="pill pill-out">All issued</span>}
              </div>
              <div className="spread" style={{ fontSize: 13 }}>
                <span className="muted row gap-2"><BookMarked size={14} /> On the shelf</span>
                <strong>{book.availableCopies} of {book.totalCopies}</strong>
              </div>
              <div className="spread" style={{ fontSize: 13, marginTop: 8 }}>
                <span className="muted row gap-2"><MapPin size={14} /> Shelf code</span>
                <strong>{book.shelf}</strong>
              </div>
            </div>
          </div>

          <div>
            <span className="eyebrow">{book.category}</span>
            <h1 style={{ fontSize: 'clamp(30px, 4vw, 44px)', margin: '12px 0 10px' }}>{book.title}</h1>
            <p className="muted" style={{ fontSize: 16, margin: 0 }}>by {book.author}</p>

            <div className="row gap-4 wrap" style={{ marginTop: 18 }}>
              <span className="rating" style={{ fontSize: 14 }}>
                <Star size={15} fill="currentColor" /> {book.rating?.toFixed(1)}
                <span className="muted" style={{ fontWeight: 400 }}>/ 5.0</span>
              </span>
              <span className="pill pill-soft"><Calendar size={12} /> {book.year}</span>
              <span className="pill pill-soft"><FileText size={12} /> {book.pages} pages</span>
              <span className="pill pill-soft"><Globe size={12} /> {book.language}</span>
            </div>

            <p style={{ marginTop: 24, fontSize: 15.5, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
              {book.description}
            </p>

            <div className="row gap-3 wrap" style={{ marginTop: 28 }}>
              <button
                className="btn btn-primary"
                onClick={borrow}
                disabled={busy || book.availableCopies === 0}
              >
                {busy ? <span className="spinner" /> : <BookMarked size={16} />}
                {book.availableCopies === 0 ? 'No copies available' : 'Borrow this book'}
              </button>
              <Link to="/catalog" className="btn btn-ghost">
                <ArrowLeft size={15} /> Back to catalogue
              </Link>
            </div>

            {message && (
              <div
                className={`notice ${message.toLowerCase().includes('issued') ? 'notice-ok' : 'notice-err'}`}
                style={{ marginTop: 18 }}
              >
                {message.toLowerCase().includes('issued') ? <CheckCircle2 size={16} /> : null}
                <span>{message}</span>
              </div>
            )}
            {!isAuthenticated && (
              <div className="notice notice-info" style={{ marginTop: 18 }}>
                <span>
                  You are browsing as a guest. <Link to="/login" style={{ textDecoration: 'underline' }}>Sign in</Link> to borrow a copy.
                </span>
              </div>
            )}

            <dl className="meta-grid">
              <div><dt><Barcode size={11} style={{ verticalAlign: '-1px' }} /> ISBN-13</dt><dd>{book.isbn}</dd></div>
              <div><dt><Building2 size={11} style={{ verticalAlign: '-1px' }} /> Publisher</dt><dd>{book.publisher}</dd></div>
              <div><dt><Layers size={11} style={{ verticalAlign: '-1px' }} /> Collection</dt><dd>{book.category}</dd></div>
              <div><dt><Calendar size={11} style={{ verticalAlign: '-1px' }} /> First published</dt><dd>{book.year}</dd></div>
            </dl>

            <div className="row gap-2 wrap" style={{ marginTop: 22 }}>
              {book.tags?.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>

            <div className="notice notice-info" style={{ marginTop: 26 }}>
              <span>
                <strong>Availability note:</strong> {book.availableCopies > 0
                  ? `${book.availableCopies} ${book.availableCopies === 1 ? 'copy is' : 'copies are'} on the shelf right now. Issue period is 14 days with up to 2 renewals.`
                  : 'Every copy is currently issued. Please check back — copies are returned to the shelf as soon as they are handed in.'}
              </span>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 70 }}>
            <div className="section-head">
              <div>
                <span className="eyebrow">Same shelf</span>
                <h2 style={{ fontSize: 26 }}>More from {book.category}</h2>
              </div>
            </div>
            <div className="book-grid">
              {related.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
