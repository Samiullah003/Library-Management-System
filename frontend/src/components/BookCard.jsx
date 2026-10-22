import { Link } from 'react-router-dom'
import { Star, BookMarked } from 'lucide-react'

export default function BookCard({ book }) {
  return (
    <Link to={`/book/${book.id}`} className="book-card">
      <div className="book-cover-wrap">
        <img src={book.coverUrl} alt={`Cover of ${book.title}`} loading="lazy" />
        {book.availableCopies > 0 ? (
          <span className="pill pill-ok badge-top">Available</span>
        ) : (
          <span className="pill pill-out badge-top">All issued</span>
        )}
        <span className="pill pill-soft badge-right"><BookMarked size={11} /> {book.availableCopies}/{book.totalCopies}</span>
      </div>
      <div className="book-body">
        <span className="cat">{book.category}</span>
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <div className="book-foot">
          <span className="rating"><Star size={13} fill="currentColor" /> {book.rating?.toFixed(1)}</span>
          <span className="muted" style={{ fontSize: 11.5 }}>{book.year} · {book.pages} pp</span>
        </div>
      </div>
    </Link>
  )
}
