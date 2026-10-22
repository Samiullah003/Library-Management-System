import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import api from '../services/api'
import BookCard from '../components/BookCard'
import BookGridSkeleton from '../components/BookGridSkeleton'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('category') || 'All')
  const [onlyAvailable, setOnlyAvailable] = useState(params.get('available') === 'true')
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {})
  }, [])

  // Debounced server-side search: every keystroke becomes an API call after 280 ms.
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      api
        .getBooks({ q: query, category, available: onlyAvailable })
        .then(setBooks)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))

      const next = new URLSearchParams()
      if (query) next.set('q', query)
      if (category !== 'All') next.set('category', category)
      if (onlyAvailable) next.set('available', 'true')
      setParams(next, { replace: true })
    }, 280)
    return () => clearTimeout(timer)
  }, [query, category, onlyAvailable, setParams])

  const chips = useMemo(() => ['All', ...categories.map((c) => c.name)], [categories])
  const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0)

  return (
    <>
      <section className="hero-mini">
        <div className="shell">
          <span className="eyebrow" style={{ color: '#e3c07d' }}>Catalogue</span>
          <h1>Search the collection</h1>
          <p>
            {books.length} title{books.length === 1 ? '' : 's'} · {totalCopies} copies ·
            results served by the Java Servlet API
          </p>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell">
          <div className="panel panel-pad" style={{ marginTop: -68, position: 'relative', zIndex: 2 }}>
            <div className="searchbar">
              <Search size={18} color="#8b9aa8" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, ISBN, publisher or tag…"
                aria-label="Search books"
              />
              {query && (
                <button className="btn btn-quiet btn-sm" onClick={() => setQuery('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
              <button className="btn btn-primary btn-sm" style={{ paddingInline: 20 }}>
                Search
              </button>
            </div>

            <div className="spread wrap" style={{ marginTop: 22 }}>
              <div className="filters">
                <span className="row gap-2 muted" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}>
                  <SlidersHorizontal size={14} /> Filter
                </span>
                {chips.map((c) => (
                  <button
                    key={c}
                    className={`chip ${category === c ? 'active' : ''}`}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                />
                Available copies only
              </label>
            </div>
          </div>

          {error && <div className="notice notice-err" style={{ marginTop: 22 }}>{error}</div>}

          <div className="spread" style={{ margin: '34px 0 20px' }}>
            <h2 style={{ fontSize: 22 }}>
              {category === 'All' ? 'All titles' : category}
              <span className="muted" style={{ fontSize: 14, fontFamily: 'var(--font-sans)', marginLeft: 10, fontWeight: 400 }}>
                {books.length} result{books.length === 1 ? '' : 's'}
              </span>
            </h2>
          </div>

          {loading ? (
            <BookGridSkeleton count={8} />
          ) : books.length === 0 ? (
            <div className="panel empty">
              <div className="icon-wrap"><Search size={26} /></div>
              <h3>No books matched that search</h3>
              <p>Try a different title, clear the filters, or browse the whole collection.</p>
              <button
                className="btn btn-primary btn-sm"
                style={{ marginTop: 20 }}
                onClick={() => { setQuery(''); setCategory('All'); setOnlyAvailable(false) }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="book-grid">
              {books.map((b) => <BookCard key={b.id} book={b} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
