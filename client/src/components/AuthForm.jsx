import { useState } from 'react'
import { apiRequest } from '../api.js'

export default function AuthForm({ onAuthenticated }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const body = mode === 'register' ? form : { email: form.email, password: form.password }
      const data = await apiRequest(`/auth/${mode}`, { method: 'POST', body })
      onAuthenticated(data)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  function switchMode() {
    setMode((current) => (current === 'login' ? 'register' : 'login'))
    setError('')
  }

  return (
    <main className="auth-card">
      <p className="eyebrow">MERN task manager</p>
      <h1>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
      <p className="summary">
        {mode === 'login' ? 'Log in to view your saved tasks.' : 'Your tasks stay private to your account.'}
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <label>
            Name
            <input name="name" value={form.name} onChange={updateField} minLength="2" required />
          </label>
        )}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={updateField} required />
        </label>
        <label>
          Password
          <input name="password" type="password" value={form.password} onChange={updateField} minLength="6" required />
        </label>
        {error && <div className="error-message" role="alert">{error}</div>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Register'}
        </button>
      </form>

      <p className="switch-mode">
        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button type="button" className="text-button" onClick={switchMode}>
          {mode === 'login' ? 'Register' : 'Log in'}
        </button>
      </p>
    </main>
  )
}
