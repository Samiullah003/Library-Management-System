import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BookOpen, Sparkles, Cpu, GraduationCap, Clock, ShieldCheck, Search,
} from 'lucide-react'
import api from '../services/api'
import BookCard from '../components/BookCard'
import BookGridSkeleton from '../components/BookGridSkeleton'

const categoryInfo = {
  'Biography & Inspiration': {
    icon: <Sparkles size={20} />,
    blurb: 'Six titles from Dr. A. P. J. Abdul Kalam — the Missile Man who became a teacher.',
  },
  'Computer Engineering': {
    icon: <Cpu size={20} />,
    blurb: 'Prescribed Mumbai University textbooks for Data Structures through Algorithms.',
  },
}

export default function Home() {
  const [books, setBooks] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    Promise.all([api.getBooks(), api.getStats()])
      .then(([list, s]) => {
        if (!alive) return
        setBooks(list)
        setStats(s)
      })
      .catch((e) => alive && setError(e.message))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const kalam = books.filter((b) => b.category === 'Biography & Inspiration')
  const engineering = books.filter((b) => b.category === 'Computer Engineering')

  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <section className="hero">
        <div className="hero-media">
          <img src="/images/hero-library.jpg" alt="Grand library reading hall" />
        </div>
        <div className="shell-wide hero-inner">
          <div>
            <span className="eyebrow">MU Central Library · Est. 1958</span>
            <h1>Every book has a <em>waiting reader</em>.</h1>
            <p>
              Search the catalogue, place a borrow request and track your due dates — all in one
              place. A complete Library Management System built on React and a Java Servlet API,
              with no database to configure.
            </p>
            <div className="hero-actions">
              <Link to="/catalog" className="btn btn-brass">
                Browse the catalogue <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn btn-ghost" style={{ color: '#f7f2e7', borderColor: 'rgba(247,242,231,.4)' }}>
                Member sign in
              </Link>
            </div>
          </div>

          <aside className="hero-card">
            <h4 style={{ marginBottom: 6 }}>The Kalam shelf</h4>
            <div className="kalam" style={{ display: 'flex' }}>
              <img src="/covers/wings-of-fire.svg" alt="Wings of Fire cover" />
              <div>
                <strong>Wings of Fire</strong>
                <span>Autobiography · 1999</span>
              </div>
            </div>
            <div className="kalam" style={{ display: 'flex' }}>
              <img src="/covers/ignited-minds.svg" alt="Ignited Minds cover" />
              <div>
                <strong>Ignited Minds</strong>
                <span>Unleashing the power within India</span>
              </div>
            </div>
            <div className="kalam" style={{ display: 'flex' }}>
              <img src="/covers/turning-points.svg" alt="Turning Points cover" />
              <div>
                <strong>Turning Points</strong>
                <span>A journey through challenges</span>
              </div>
            </div>
            <p className="hero-quote">
              “Books are the most silent and the most loyal friends.” — the shelf note that
              started this collection.
            </p>
          </aside>
        </div>
      </section>

      {/* --------------------------------------------------------- stats */}
      <section className="stats">
        <div className="shell-wide">
          <div className="stats-grid">
            <div className="stat">
              <strong>{stats ? stats.titles : '—'}</strong>
              <span>Titles</span>
              <small>Curated, syllabus-aligned</small>
            </div>
            <div className="stat">
              <strong>{stats ? stats.totalCopies : '—'}</strong>
              <span>Copies</span>
              <small>{stats ? `${stats.availableCopies} on the shelf` : 'Loading'}</small>
            </div>
            <div className="stat">
              <strong>{stats ? stats.issuedCopies : '—'}</strong>
              <span>Issued</span>
              <small>{stats ? `${stats.activeLoans} active loans` : 'Loading'}</small>
            </div>
            <div className="stat">
              <strong>14</strong>
              <span>Days per issue</span>
              <small>2 renewals allowed</small>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- categories */}
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Collections</span>
              <h2>Two shelves worth your evening</h2>
              <p>
                A small, deliberate collection: the complete Kalam reading list for inspiration, and
                the standard Mumbai University Computer Engineering references for semester work.
              </p>
            </div>
            <Link to="/catalog" className="btn btn-ghost btn-sm">
              View all {stats ? `${stats.titles} titles` : 'titles'} <ArrowRight size={15} />
            </Link>
          </div>

          <div className="cat-grid">
            {Object.entries(categoryInfo).map(([name, info]) => {
              const count = books.filter((b) => b.category === name).length
              return (
                <Link key={name} to={`/catalog?category=${encodeURIComponent(name)}`} className="cat-tile">
                  <span className="count">{count} titles</span>
                  <div>
                    <span className="icon">{info.icon}</span>
                    <h3>{name}</h3>
                    <p>{info.blurb}</p>
                  </div>
                  <span className="row gap-2" style={{ fontSize: 13, fontWeight: 600, color: 'var(--brass-dark)', marginTop: 18 }}>
                    Explore <ArrowRight size={14} />
                  </span>
                </Link>
              )
            })}

            <div className="cat-tile" style={{ background: 'var(--ink)', color: '#f4ecdc', borderColor: 'var(--ink)' }}>
              <span className="count" style={{ color: '#a9bac8' }}>Open shelf</span>
              <div>
                <span className="icon" style={{ background: 'rgba(198,155,72,.18)', color: '#e3c07d' }}>
                  <Search size={20} />
                </span>
                <h3 style={{ color: '#fff' }}>Search everything</h3>
                <p style={{ color: '#bccbd8' }}>
                  Query by title, author, ISBN, publisher or syllabus tag — results come straight from the Java API.
                </p>
              </div>
              <Link to="/catalog" className="row gap-2" style={{ fontSize: 13, fontWeight: 600, color: '#e3c07d', marginTop: 18 }}>
                Start a search <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ kalam row */}
      <section className="section-tight" style={{ background: '#fff', borderBlock: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Shelf one</span>
              <h2>Dr. A. P. J. Abdul Kalam</h2>
              <p>Six books by the scientist-president — autobiography, vision documents and letters to the young.</p>
            </div>
            <Link to="/catalog?category=Biography%20%26%20Inspiration" className="btn btn-ghost btn-sm">
              All Kalam titles <ArrowRight size={15} />
            </Link>
          </div>
          {loading ? <BookGridSkeleton count={4} /> : (
            <div className="book-grid">{kalam.slice(0, 4).map((b) => <BookCard key={b.id} book={b} />)}</div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------ engineering row */}
      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Shelf two</span>
              <h2>Computer Engineering · Mumbai University</h2>
              <p>Data structures, databases, operating systems, networks and algorithms — the books actually on the MU reading list.</p>
            </div>
            <Link to="/catalog?category=Computer%20Engineering" className="btn btn-ghost btn-sm">
              All engineering titles <ArrowRight size={15} />
            </Link>
          </div>
          {error && <div className="notice notice-err" style={{ marginBottom: 20 }}>{error}</div>}
          {loading ? <BookGridSkeleton count={4} /> : (
            <div className="book-grid">{engineering.slice(0, 4).map((b) => <BookCard key={b.id} book={b} />)}</div>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------- steps */}
      <section className="section" style={{ background: '#fff', borderBlock: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">How it works</span>
              <h2>From search to return in three steps</h2>
            </div>
          </div>
          <div className="steps">
            <div className="step">
              <span className="num">1</span>
              <h3>Find the title</h3>
              <p>Filter by category or type an author, ISBN or syllabus keyword. Availability updates live from the API.</p>
            </div>
            <div className="step">
              <span className="num">2</span>
              <h3>Borrow a copy</h3>
              <p>Sign in and press Borrow. The servlet issues the copy, decrements the shelf count and sets a 14-day due date.</p>
            </div>
            <div className="step">
              <span className="num">3</span>
              <h3>Return or renew</h3>
              <p>Track everything under My Books — renew twice, or return and release the copy back to the catalogue.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- quote */}
      <section className="quote-band">
        <div className="shell">
          <blockquote>
            “You have to dream before your dreams can come true.”
            <cite>Dr. A. P. J. Abdul Kalam</cite>
          </blockquote>
        </div>
      </section>

      {/* ------------------------------------------------------ facility */}
      <section className="section">
        <div className="shell">
          <div className="split">
            <div className="frame">
              <img src="/images/reading-room.jpg" alt="Reading room with long tables" style={{ aspectRatio: '4 / 3' }} />
            </div>
            <div>
              <span className="eyebrow">The reading room</span>
              <h2 style={{ fontSize: 34, marginTop: 12 }}>A quiet place to think, six days a week.</h2>
              <p className="lead" style={{ marginTop: 14 }}>
                The central reading room seats 240 readers across two floors, with a dedicated
                reference section, a digital catalog terminal and a photocopy desk. Membership is
                free for enrolled students.
              </p>
              <div className="stack gap-3" style={{ marginTop: 26 }}>
                <span className="row gap-3"><Clock size={17} color="var(--brass-dark)" /> Mon–Sat · 8:00 AM to 10:00 PM</span>
                <span className="row gap-3"><GraduationCap size={17} color="var(--brass-dark)" /> Open to students, faculty and staff</span>
                <span className="row gap-3"><ShieldCheck size={17} color="var(--brass-dark)" /> Session-based login, BCrypt-hashed passwords</span>
                <span className="row gap-3"><BookOpen size={17} color="var(--brass-dark)" /> 14-day issue period, 2 renewals</span>
              </div>
              <div className="row gap-3 wrap" style={{ marginTop: 30 }}>
                <Link to="/about" className="btn btn-primary btn-sm">Library rules</Link>
                <Link to="/contact" className="btn btn-ghost btn-sm">Ask the desk</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
