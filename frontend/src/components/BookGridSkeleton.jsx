export default function BookGridSkeleton({ count = 8 }) {
  return (
    <div className="book-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="book-card" style={{ padding: 0 }}>
          <div className="skeleton" style={{ aspectRatio: '2 / 3', borderRadius: 0 }} />
          <div style={{ padding: 18, display: 'grid', gap: 10 }}>
            <div className="skeleton" style={{ height: 10, width: '45%' }} />
            <div className="skeleton" style={{ height: 16, width: '90%' }} />
            <div className="skeleton" style={{ height: 12, width: '65%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}
