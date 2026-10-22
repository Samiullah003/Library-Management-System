import { Link } from 'react-router-dom'
import { BookOpen, Clock, Users, ShieldCheck, FileText, Wifi, Coffee, Library } from 'lucide-react'

export default function About() {
  return (
    <>
      <section className="hero-mini">
        <div className="shell">
          <span className="eyebrow" style={{ color: '#e3c07d' }}>About the library</span>
          <h1>A reading room, a catalogue, and a very old habit.</h1>
          <p>
            The Central Library has served the university since 1958. This site is its digital
            counterpart — the same rules, on a modern stack.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="split">
            <div>
              <span className="eyebrow">Our story</span>
              <h2 style={{ fontSize: 34, marginTop: 12 }}>Built around three thousand readers a week.</h2>
              <p className="lead" style={{ marginTop: 14 }}>
                The library began as a single reading room with 400 donated volumes. Today it holds
                a curated reference collection across engineering, sciences and the humanities, plus
                a small but much-loved shelf of biographies.
              </p>
              <p className="lead" style={{ marginTop: 12 }}>
                The digital catalogue you are using is a teaching project: a React front end talking
                to a Java Servlet API. There is no database — the fifteen titles are seeded directly
                into the servlet's memory, which keeps the project runnable in a single afternoon.
              </p>
              <div className="row gap-3 wrap" style={{ marginTop: 26 }}>
                <Link to="/catalog" className="btn btn-primary btn-sm">Browse the collection</Link>
                <Link to="/contact" className="btn btn-ghost btn-sm">Contact the desk</Link>
              </div>
            </div>
            <div className="frame">
              <img src="/images/study.jpg" alt="Students studying in the library" style={{ aspectRatio: '4 / 5' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: '#fff', borderBlock: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Facilities</span>
              <h2>What is inside</h2>
            </div>
          </div>
          <div className="cat-grid">
            {[
              { icon: <Library size={20} />, title: '240-seat reading room', text: 'Two floors, silent-study zones and a group discussion corner.' },
              { icon: <Wifi size={20} />, title: 'Campus Wi-Fi', text: 'Free for enrolled students; eduroam supported across both floors.' },
              { icon: <FileText size={20} />, title: 'Reference & journals', text: 'Bound volumes, IEEE access terminals and a photocopy desk.' },
              { icon: <Coffee size={20} />, title: 'Reading café', text: 'Ground floor, open till 9 PM. No food inside the stacks, please.' },
            ].map((f) => (
              <div key={f.title} className="cat-tile" style={{ minHeight: 150 }}>
                <span className="icon">{f.icon}</span>
                <div>
                  <h3 style={{ fontSize: 18, marginTop: 16 }}>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">Rules</span>
              <h2>Borrowing policy</h2>
              <p>Short, and enforced by the servlet on every request.</p>
            </div>
          </div>

          <div className="panel panel-pad">
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr><th>Rule</th><th>Student</th><th>Librarian</th></tr>
                </thead>
                <tbody>
                  <tr><td>Copies at a time</td><td>5</td><td>Unlimited</td></tr>
                  <tr><td>Issue period</td><td>14 days</td><td>14 days</td></tr>
                  <tr><td>Renewals per copy</td><td>2 (14 days each)</td><td>2</td></tr>
                  <tr><td>Overdue fine</td><td>₹2 per day</td><td>—</td></tr>
                  <tr><td>Reference section</td><td>Read on premises</td><td>Issue allowed</td></tr>
                  <tr><td>Add / remove titles</td><td>Not permitted</td><td>Permitted</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="steps" style={{ marginTop: 30 }}>
            <div className="step">
              <span className="num"><Clock size={16} /></span>
              <h3>Opening hours</h3>
              <p>Monday to Saturday, 8:00 AM – 10:00 PM. Closed on public holidays.</p>
            </div>
            <div className="step">
              <span className="num"><Users size={16} /></span>
              <h3>Membership</h3>
              <p>Free for students, faculty and staff. Register online with your college email.</p>
            </div>
            <div className="step">
              <span className="num"><ShieldCheck size={16} /></span>
              <h3>Security</h3>
              <p>Passwords hashed with BCrypt; sessions handled by Tomcat's HttpSession.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ background: '#fff', borderBlock: '1px solid var(--line)' }}>
        <div className="shell">
          <div className="section-head">
            <div><span className="eyebrow">Technology</span><h2>How this demo is built</h2></div>
          </div>
          <div className="book-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {[
              ['Front end', 'React 19, Vite, React Router, Tailwind CSS v4, hand-written design tokens.'],
              ['Back end', 'Java 11 Servlets (Jakarta EE 5), Maven WAR, deployed on Tomcat 10.'],
              ['Data', 'In-memory Java collections seeded with 15 titles. No database, no schema.'],
              ['Session', 'HttpSession + JSESSIONID cookie, CORS with credentials enabled.'],
            ].map(([t, d]) => (
              <div key={t} className="panel panel-pad" style={{ padding: 24 }}>
                <span className="eyebrow" style={{ marginBottom: 10 }}>{t}</span>
                <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--slate)' }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
