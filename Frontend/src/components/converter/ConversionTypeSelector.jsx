import { FileText, FileType } from 'lucide-react'
import { CONVERSION_TYPES } from '../../hooks/useConverter'

const OPTIONS = [
  {
    type: CONVERSION_TYPES.TO_PDF,
    icon: FileText,
    label: 'Convert to PDF',
    description: 'Supported: .txt, .docx, .doc',
    badge: 'PDF',
    badgeClass: 'badge--pdf',
  },
  {
    type: CONVERSION_TYPES.TO_WORD,
    icon: FileType,
    label: 'Convert to Word',
    description: 'Supported: .txt, .pdf',
    badge: 'DOCX',
    badgeClass: 'badge--docx',
  },
]

export default function ConversionTypeSelector({ value, onChange, supportedConversions }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      <label className="form-label">Conversion Type</label>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
        {OPTIONS.map(({ type, icon: Icon, label, description, badge, badgeClass }) => {
          const isSupported = !supportedConversions?.length || supportedConversions.includes(type)
          const isActive = value === type

          return (
            <button
              key={type}
              onClick={() => isSupported && onChange(type)}
              disabled={!isSupported}
              style={{
                padding: 'var(--sp-4)',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${isActive ? 'rgba(99,102,241,0.4)' : 'var(--border-base)'}`,
                background: isActive ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                cursor: isSupported ? 'pointer' : 'not-allowed',
                opacity: isSupported ? 1 : 0.4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 'var(--sp-2)',
                textAlign: 'left',
                transition: 'all var(--duration-fast) var(--ease-out)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--accent-primary)' : 'var(--bg-overlay)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    transition: 'all var(--duration-fast)',
                  }}
                >
                  <Icon size={18} />
                </div>
                <span className={`badge ${badgeClass}`}>{badge}</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
              }}>
                {label}
              </span>
              <span style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
              }}>
                {description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
