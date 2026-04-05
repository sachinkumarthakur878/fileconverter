import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, FileArchive } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/common/Spinner'
import ThemeToggle from '../components/common/ThemeToggle'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading } = useAuth()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  const from = location.state?.from?.pathname || '/dashboard'

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setApiError('')
    const result = await login(form)
    if (result.success) navigate(from, { replace: true })
    else setApiError(result.message)
  }

  return (
    <div className="auth-page">
      <div className="auth-page__visual">
        <div className="visual-glow" />
        <div className="visual-glow-2" />
        <div className="auth-page__visual-content">
          <div className="auth-page__visual-tag">
            <span>✦</span> File Tools Platform
          </div>
          <h2 className="auth-page__visual-title">
            Convert, compress,<br /><span>conquer</span>
          </h2>
          <p className="auth-page__visual-description">
            Convert documents between PDF and Word, compress files to reduce size,
            and manage everything from one dashboard.
          </p>
          <div className="auth-page__visual-features">
            {[
              'Convert DOCX/TXT → PDF with full content',
              'PDF → Word with real text extraction',
              'Compress PDF, images & text files',
              'Adjustable compression quality slider',
            ].map((f) => (
              <div key={f} className="auth-page__visual-feature">
                <div className="feature-dot" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-page__form-panel">
        <div style={{ position: 'absolute', top: 'var(--sp-5)', right: 'var(--sp-5)' }}>
          <ThemeToggle />
        </div>
        <div className="auth-page__form-container">
          <div className="auth-page__form-header">
            <div className="form-logo">
              <div className="logo-icon-sm"><FileArchive /></div>
              <span>CompressIO</span>
            </div>
            <h1>Welcome back</h1>
            <p>Sign in to your account to continue</p>
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
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input id="email" type="email" className={`input ${errors.email ? 'input--error' : ''}`}
                  placeholder="you@example.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} autoComplete="email" />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrapper has-right-icon">
                <Lock className="input-icon" />
                <input id="password" type={showPass ? 'text' : 'password'}
                  className={`input ${errors.password ? 'input--error' : ''}`}
                  placeholder="Enter your password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} autoComplete="current-password" />
                <button type="button" className="input-icon input-icon--right" onClick={() => setShowPass(s => !s)} tabIndex={-1}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <button type="submit" className={`btn btn--primary btn--lg ${loading ? 'btn--loading' : ''}`}
              disabled={loading} style={{ width: '100%', marginTop: 'var(--sp-2)' }}>
              {loading ? <Spinner /> : null}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="auth-page__footer">
            Don't have an account? <Link to="/register">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
