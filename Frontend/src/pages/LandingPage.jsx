import { Link } from 'react-router-dom'
import {
  ArrowRightLeft,
  FileText,
  Zap,
  Shield,
  History,
  Download,
  FileType,
  ChevronRight,
} from 'lucide-react'
import ThemeToggle from '../components/common/ThemeToggle'

const FEATURES = [
  {
    icon: ArrowRightLeft,
    title: 'Smart Conversion',
    description: 'Convert between PDF, Word DOCX, and plain text with one click. No quality loss.',
    delay: 0,
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Server-side conversion powered by pdf-lib and Mammoth.js. Results in seconds.',
    delay: 100,
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'JWT-authenticated sessions. Your files are only accessible to your account.',
    delay: 200,
  },
  {
    icon: History,
    title: 'File History',
    description: 'Every upload and conversion is saved. Access your full file history anytime.',
    delay: 300,
  },
  {
    icon: Download,
    title: 'Instant Download',
    description: 'Converted files download automatically — no extra steps, no waiting.',
    delay: 400,
  },
  {
    icon: FileType,
    title: 'Multiple Formats',
    description: 'Supports PDF, DOCX, DOC, TXT, HTML, JPG, PNG, GIF, and WEBP uploads.',
    delay: 500,
  },
]

const CONVERSIONS = [
  { from: '.TXT', to: '.PDF', fromClass: 'txt', toClass: 'pdf' },
  { from: '.TXT', to: '.DOCX', fromClass: 'txt', toClass: 'docx' },
  { from: '.DOCX', to: '.PDF', fromClass: 'docx', toClass: 'pdf' },
  { from: '.DOC', to: '.PDF', fromClass: 'doc', toClass: 'pdf' },
  { from: '.PDF', to: '.DOCX', fromClass: 'pdf', toClass: 'docx' },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          padding: '0 var(--sp-8)',
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--indigo-500), var(--violet-500))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
            }}>
              <FileText size={18} color="white" />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'var(--text-lg)',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
            }}>
              File<span style={{ color: 'var(--accent-primary)' }}>Forge</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <ThemeToggle />
            <Link to="/login" className="btn btn--ghost btn--sm">Sign In</Link>
            <Link to="/register" className="btn btn--primary btn--sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-glow" />
        <div className="hero-section__content">
          <div className="hero-section__eyebrow">
            <Zap size={12} />
            Free Document Converter
          </div>
          <h1 className="hero-section__title">
            Convert documents<br />
            with <span>zero friction</span>
          </h1>
          <p className="hero-section__description">
            Transform your files between PDF, Word, and text formats instantly.
            Secure, fast, and built for professionals who value their time.
          </p>
          <div className="hero-section__actions">
            <Link to="/register" className="btn btn--primary btn--lg">
              Start Converting Free
              <ChevronRight size={18} />
            </Link>
            <Link to="/login" className="btn btn--secondary btn--lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Supported conversions strip */}
      <div style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'var(--sp-5) var(--sp-8)',
      }}>
        <div style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--sp-6)',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            flexShrink: 0,
          }}>
            Supported Conversions
          </span>
          {CONVERSIONS.map(({ from, to, fromClass, toClass }) => (
            <div key={`${from}-${to}`} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <span className={`badge badge--${fromClass}`}>{from}</span>
              <ArrowRightLeft size={12} style={{ color: 'var(--text-tertiary)' }} />
              <span className={`badge badge--${toClass}`}>{to}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="features-grid">
        <div style={{ textAlign: 'center', marginBottom: 'var(--sp-12)' }}>
          <div style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-primary)',
            marginBottom: 'var(--sp-3)',
          }}>
            Everything You Need
          </div>
          <h2 style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 'var(--sp-4)',
          }}>
            Built for document workflows
          </h2>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--text-secondary)',
            maxWidth: 480,
            margin: '0 auto',
            lineHeight: 'var(--leading-relaxed)',
          }}>
            Everything you need to convert, manage, and organise your documents.
          </p>
        </div>

        <div className="grid-3">
          {FEATURES.map(({ icon: Icon, title, description, delay }) => (
            <div
              key={title}
              className="card feature-card card--hoverable"
              style={{ animationDelay: `${delay}ms` }}
            >
              <div className="feature-card__icon-wrap">
                <Icon />
              </div>
              <h3 className="feature-card__title">{title}</h3>
              <p className="feature-card__description">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, var(--indigo-900) 0%, var(--slate-900) 100%)',
        padding: 'var(--sp-20) var(--sp-8)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 300,
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 'var(--text-4xl)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: 'white',
            marginBottom: 'var(--sp-4)',
          }}>
            Ready to convert your files?
          </h2>
          <p style={{
            fontSize: 'var(--text-lg)',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 'var(--sp-8)',
          }}>
            Create a free account and start converting in under 30 seconds.
          </p>
          <Link to="/register" className="btn btn--primary btn--lg" style={{ fontSize: 'var(--text-base)' }}>
            Get Started Free
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: 'var(--sp-6) var(--sp-8)',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
          © {new Date().getFullYear()} FileForge. Built with React + Node.js.
        </p>
      </footer>
    </div>
  )
}
