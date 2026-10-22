import { useState } from 'react'
import { Mail, MapPin, Phone, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react'
import api from '../services/api'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'Borrowing enquiry', message: '' })
  const [busy, setBusy] = useState(false)
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setOk(''); setError('')
    try {
      const data = await api.sendMessage(form)
      setOk(`Thank you ${form.name}. Your reference is ${data.reference} — the desk replies within one working day.`)
      setForm({ name: '', email: '', subject: 'Borrowing enquiry', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <section className="hero-mini">
        <div className="shell">
          <span className="eyebrow" style={{ color: '#e3c07d' }}>Contact</span>
          <h1>Ask the circulation desk</h1>
          <p>Renewals, lost books, membership cards, or a title you think we should stock — send a note.</p>
        </div>
      </section>

      <section className="section-tight">
        <div className="shell" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 30, alignItems: 'start' }}>
          <div className="panel panel-pad">
            <h2 style={{ fontSize: 24 }}>Send an enquiry</h2>
            <p className="muted" style={{ fontSize: 13.5 }}>All fields are required. The servlet returns a reference number.</p>

            <form onSubmit={submit} style={{ display: 'grid', gap: 16, marginTop: 22 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label htmlFor="cname">Your name</label>
                  <input id="cname" className="input" value={form.name} onChange={set('name')} required />
                </div>
                <div className="field">
                  <label htmlFor="cemail">Email</label>
                  <input id="cemail" type="email" className="input" value={form.email} onChange={set('email')} required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="csubject">Subject</label>
                <select id="csubject" className="select" value={form.subject} onChange={set('subject')}>
                  <option>Borrowing enquiry</option>
                  <option>Renewal or due date</option>
                  <option>Lost or damaged book</option>
                  <option>New membership</option>
                  <option>Suggest a title</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="cmessage">Message</label>
                <textarea id="cmessage" className="textarea" value={form.message} onChange={set('message')} placeholder="Tell us what you need…" required />
              </div>

              {ok && <div className="notice notice-ok"><CheckCircle2 size={16} /><span>{ok}</span></div>}
              {error && <div className="notice notice-err"><span>{error}</span></div>}

              <button className="btn btn-primary" type="submit" disabled={busy}>
                <Send size={15} /> {busy ? 'Sending…' : 'Send enquiry'}
              </button>
            </form>
          </div>

          <div className="stack gap-4">
            <div className="panel panel-pad" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 17, marginBottom: 14 }}>Visit us</h3>
              <div className="stack gap-3" style={{ fontSize: 13.5, color: 'var(--slate)' }}>
                <span className="row gap-3"><MapPin size={15} color="var(--brass-dark)" /> Central Library, Vidyanagari Campus, Kalina, Mumbai 400098</span>
                <span className="row gap-3"><Phone size={15} color="var(--brass-dark)" /> +91 22 2652 0000</span>
                <span className="row gap-3"><Mail size={15} color="var(--brass-dark)" /> library@mu.ac.in</span>
                <span className="row gap-3"><Clock size={15} color="var(--brass-dark)" /> Mon–Sat, 8:00 AM – 10:00 PM</span>
              </div>
            </div>

            <div className="panel" style={{ overflow: 'hidden' }}>
              <img src="/images/reading-room.jpg" alt="Library reading room" style={{ width: '100%', height: 190, objectFit: 'cover' }} />
              <div className="panel-pad" style={{ padding: 22 }}>
                <h3 style={{ fontSize: 16 }}><MessageSquare size={15} style={{ verticalAlign: '-2px' }} /> At the desk</h3>
                <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--slate)' }}>
                  Reference help is available 9 AM – 6 PM. For renewals outside those hours, use
                  My Books — it works around the clock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
