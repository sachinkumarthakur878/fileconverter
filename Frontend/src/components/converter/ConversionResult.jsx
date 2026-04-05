import { CheckCircle, AlertCircle, RotateCcw, ArrowRightLeft } from 'lucide-react'

export default function ConversionResult({ status, resultFilename, error, onReset }) {
  if (status === 'done') {
    return (
      <div className="conversion-result">
        <div className="conversion-result__icon">
          <CheckCircle />
        </div>
        <h3 className="conversion-result__title">Conversion Complete!</h3>
        <p className="conversion-result__desc">
          Your file <strong style={{ color: 'var(--text-primary)' }}>{resultFilename}</strong> has been downloaded automatically.
        </p>
        <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-2)' }}>
          <button className="btn btn--primary" onClick={onReset}>
            <ArrowRightLeft size={16} />
            Convert Another
          </button>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="conversion-result">
        <div className="conversion-result__icon" style={{
          background: 'var(--error-bg)',
          borderColor: 'rgba(244,63,94,0.3)',
          color: 'var(--error)',
          animation: 'none',
        }}>
          <AlertCircle />
        </div>
        <h3 className="conversion-result__title">Conversion Failed</h3>
        <p className="conversion-result__desc">{error}</p>
        <button className="btn btn--secondary" onClick={onReset}>
          <RotateCcw size={16} />
          Try Again
        </button>
      </div>
    )
  }

  return null
}
