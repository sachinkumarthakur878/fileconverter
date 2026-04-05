export default function ProgressBar({ progress, status }) {
  const isIndeterminate = status === 'converting'
  const label = status === 'uploading'
    ? `Uploading… ${progress}%`
    : 'Converting…'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-secondary)',
        fontWeight: 500,
      }}>
        <span>{label}</span>
        {!isIndeterminate && <span>{progress}%</span>}
      </div>
      <div className={`progress ${isIndeterminate ? 'progress--indeterminate' : ''}`}>
        <div
          className="progress__bar"
          style={!isIndeterminate ? { width: `${progress}%` } : {}}
        />
      </div>
    </div>
  )
}
