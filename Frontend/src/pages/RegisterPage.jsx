import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, FileText } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'
import ThemeToggle from '../components/common/ThemeToggle'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setApiError('')

    const result = await register(form)
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setApiError(result.message)
    }
  }

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-page__visual">
        <div className="visual-glow" />
        <div className="visual-glow-2" />
        <div className="auth-page__visual-content">
          <div className="auth-page__visual-tag">
            <span>✦</span> Join FileForge Today
          </div>
          <h2 className="auth-page__visual-title">
            Your files,<br /><span>your workflow</span>
          </h2>
          <p className="auth-page__visual-description">
            Get started free. Convert documents seamlessly, manage your file history,
            and streamline your document workflow.
          </p>
          <div className="auth-page__visual-features">
            {[
              'No credit card required',
              'Secure file handling & storage',
              'Instant document conversion',
              'Full conversion history',
            ].map((f) => (
              <div key={f} className="auth-page__visual-feature">
                <div className="feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-page__form-panel">
        <div style={{ position: 'absolute', top: 'var(--sp-5)', right: 'var(--sp-5)' }}>
          <ThemeToggle />
        </div>

        <div className="auth-page__form-container">
          <div className="auth-page__form-header">
            <div className="form-logo">
              <div className="logo-icon-sm"><FileText /></div>
              <span>FileForge</span>
            </div>
            <h1>Create account</h1>
            <p>Start converting files for free</p>
          </div>

          {apiError && (
            <div style={{
              padding: 'var(--sp-3) var(--sp-4)',
              background: 'var(--error-bg)',
              border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--error)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--sp-5)',
            }}>
              {apiError}
            </div>
          )}

          <form className="auth-page__form" onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">Full name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  id="name"
                  type="text"
                  className={`input ${errors.name ? 'input--error' : ''}`}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  id="email"
                  type="email"
                  className={`input ${errors.email ? 'input--error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper has-right-icon">
                <Lock className="input-icon" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  className={`input ${errors.password ? 'input--error' : ''}`}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-icon input-icon--right"
                  onClick={() => setShowPass(s => !s)}
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button
              type="submit"
              className={`btn btn--primary btn--lg ${loading ? 'btn--loading' : ''}`}
              disabled={loading}
              style={{ width: '100%', marginTop: 'var(--sp-2)' }}
            >
              {loading ? <Spinner /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="auth-page__footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
