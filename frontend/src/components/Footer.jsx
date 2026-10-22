import { Link } from 'react-router-dom'
import { BookOpen, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: 16 }}>
              <span className="brand-mark"><BookOpen size={20} /></span>
              <span className="brand-text">
                <strong>MU Central Library</strong>
                <small>Est. 1958</small>
              </span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 34 + 'ch', color: '#93a6b5' }}>
              A full-stack Library Management System demonstration — React front end,
              Java Servlet API, no database, curated collection.
            </p>
            <div style={{ display: 'flex', gap: 14, marginTop: 18, fontSize: 12.5, color: '#8ea1b1' }}>
              <span><MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> Vidyanagari, Mumbai</span>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <Link to="/catalog">Full catalogue</Link>
            <Link to="/catalog?category=Biography%20%26%20Inspiration">Kalam collection</Link>
            <Link to="/catalog?category=Computer%20Engineering">MU engineering</Link>
            <Link to="/my-books">My borrowed books</Link>
          </div>

          <div>
            <h4>Library</h4>
            <Link to="/about">About &amp; rules</Link>
            <Link to="/contact">Contact the desk</Link>
            <Link to="/login">Member sign in</Link>
            <Link to="/login?mode=register">New membership</Link>
          </div>

          <div>
            <h4>Circulation hours</h4>
            <p style={{ fontSize: 13.5, color: '#93a6b5', margin: '0 0 10px' }}>
              Monday – Saturday<br />8:00 AM – 10:00 PM
            </p>
            <p style={{ fontSize: 13.5, color: '#93a6b5', margin: 0 }}>
              <Mail size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> library@mu.ac.in<br />
              <Phone size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> +91 22 2652 0000
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} MU Central Library · Academic demo project.</span>
          <span>Built with React 19 + Vite · Java Servlets (Jakarta EE) · Tomcat 10</span>
        </div>
      </div>
    </footer>
  )
}
