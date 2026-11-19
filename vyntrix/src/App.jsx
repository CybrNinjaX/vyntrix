import { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function App() {
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
    setErrors((current) => ({ ...current, [event.target.name]: '' }))
    setMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setErrors({})
    setMessage('')
    try {
      const response = await fetch(`${API_URL}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) {
        setErrors(data.errors || {})
        setMessage(data.detail || 'Please check your information and try again.')
        return
      }
      setMessage(`Welcome, ${data.user.username}! Your account is ready.`)
      setForm({ username: '', email: '', password: '' })
    } catch {
      setMessage('Could not reach the server. Please try again in a moment.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="register-page">
      <section className="register-card" aria-labelledby="register-title">
        <a className="brand" href="/" aria-label="Vyntrix home"><span className="brand-mark">V</span> vyntrix</a>
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1 id="register-title">Create your account</h1>
        <p className="intro">Join Vyntrix and make room for what’s next.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="username">Username</label>
          <input id="username" name="username" autoComplete="username" value={form.username} onChange={updateField} placeholder="Choose a username" required />
          {errors.username && <span className="field-error">{errors.username}</span>}

          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
          {errors.email && <span className="field-error">{errors.email}</span>}

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={updateField} placeholder="At least 8 characters" minLength={8} required />
          {errors.password && <span className="field-error">{errors.password}</span>}

          <button type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'} <span aria-hidden="true">→</span></button>
        </form>
        {message && <p className={message.startsWith('Welcome') ? 'form-message success' : 'form-message'} role="status">{message}</p>}
        <p className="terms">By creating an account, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.</p>
      </section>
      <aside className="register-aside" aria-label="Vyntrix introduction">
        <div className="aside-orb orb-one" /><div className="aside-orb orb-two" />
        <div className="aside-content">
          <span className="aside-label">MAKE IT YOURS</span>
          <h2>Ideas move<br />better together.</h2>
          <p>A place to bring your plans, people, and possibilities into focus.</p>
          <div className="aside-dots"><i /><i /><i /></div>
        </div>
        <span className="aside-footer">VYNTRIX · 2026</span>
      </aside>
    </main>
  )
}

export default App
