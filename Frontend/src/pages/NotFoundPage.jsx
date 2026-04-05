import { Link } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-6)',
      padding: 'var(--sp-8)', textAlign: 'center', background: 'var(--bg-base)',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 'var(--radius-2xl)',
        background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)',
      }}>
        <AlertTriangle size={36} />
      </div>
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'var(--text-5xl)',
          fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: 'var(--sp-2)',
        }}>404</h1>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>This page doesn't exist.</p>
      </div>
      <Link to="/" className="btn btn--primary"><Home size={16} /> Back to Home</Link>
    </div>
  )
}
