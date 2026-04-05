import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Minimize2, UploadCloud, CheckCircle, AlertCircle, RotateCcw, X, Info } from 'lucide-react'
import { fileAPI } from '../api'
import { formatBytes, getFileTypeInfo, getExtension } from '../utils/helpers'
import ProgressBar from '../components/converter/ProgressBar'
import toast from 'react-hot-toast'

const SUPPORTED_COMPRESS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp', '.txt']

const QUALITY_PRESETS = [
  { label: 'Maximum Compression', value: 0.2, desc: 'Smallest file, lower quality' },
  { label: 'Balanced', value: 0.6, desc: 'Good balance of size & quality' },
  { label: 'High Quality', value: 0.85, desc: 'Minimal compression, best quality' },
]

function QualitySlider({ value, onChange }) {
  const pct = Math.round(value * 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="form-label" style={{ margin: 0 }}>Compression Quality</label>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'var(--text-lg)',
          color: pct < 40 ? 'var(--rose-400)' : pct < 70 ? 'var(--amber-400)' : 'var(--emerald-400)',
        }}>
          {pct}%
        </span>
      </div>

      {/* Slider */}
      <div style={{ position: 'relative' }}>
        <input
          type="range"
          min="10"
          max="100"
          value={pct}
          onChange={e => onChange(parseInt(e.target.value) / 100)}
          style={{
            width: '100%',
            height: 6,
            appearance: 'none',
            background: `linear-gradient(to right, var(--accent-primary) ${pct}%, var(--bg-overlay) ${pct}%)`,
            borderRadius: 'var(--radius-full)',
            outline: 'none',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
        <span>Max Compression</span>
        <span>High Quality</span>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
        {QUALITY_PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => onChange(p.value)}
            title={p.desc}
            className={`btn btn--sm ${Math.abs(value - p.value) < 0.05 ? 'btn--primary' : 'btn--secondary'}`}
            style={{ flex: 1, fontSize: '0.7rem' }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CompressPage() {
  const [file, setFile] = useState(null)
  const [quality, setQuality] = useState(0.7)
  const [status, setStatus] = useState('idle') // idle | uploading | compressing | done | error
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null) // { filename, originalSize, compressedSize }
  const [error, setError] = useState('')

  const ext = file ? '.' + file.name.split('.').pop().toLowerCase() : ''
  const isSupported = SUPPORTED_COMPRESS.includes(ext)
  const isLoading = status === 'uploading' || status === 'compressing'

  const onDrop = useCallback((accepted) => {
    if (accepted.length > 0) {
      setFile(accepted[0])
      setStatus('idle')
      setResult(null)
      setError('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
    disabled: isLoading,
  })

  const reset = () => {
    setFile(null)
    setStatus('idle')
    setProgress(0)
    setResult(null)
    setError('')
  }

  const compress = async () => {
    if (!file || !isSupported) return
    setStatus('uploading')
    setProgress(0)
    setError('')

    try {
      const response = await fileAPI.compressFile(file, quality, (p) => {
        setProgress(p)
        if (p === 100) setStatus('compressing')
      })

      // Read size info from response headers
      const originalSize = parseInt(response.headers['x-original-size'] || file.size)
      const compressedSize = parseInt(response.headers['x-compressed-size'] || 0)

      // Determine output extension
      const outputExt = ext
      const baseName = file.name.replace(/\.[^.]+$/, '')
      const filename = `${baseName}-compressed${outputExt}`

      // Trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setResult({ filename, originalSize, compressedSize })
      setStatus('done')
      toast.success('File compressed successfully!')
    } catch (err) {
      let msg = 'Compression failed. Please try again.'
      if (err.response?.data) {
        // Blob error — try to parse JSON from blob
        try {
          const text = await err.response.data.text()
          const json = JSON.parse(text)
          msg = json.message || msg
        } catch {}
      }
      setError(msg)
      setStatus('error')
      toast.error(msg)
    }
  }

  const savingPct = result && result.originalSize > 0
    ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
    : 0

  const { emoji, label } = file ? getFileTypeInfo(getExtension(file.name)) : {}

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header__eyebrow">Tools</div>
        <h1 className="page-header__title">
          Compress <span>Files</span>
        </h1>
        <p className="page-header__description">
          Reduce file size while preserving quality. Adjust the compression level with the slider.
          Supports PDF, images (JPG, PNG, WEBP) and text files.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--sp-6)', alignItems: 'start' }}>

        {/* Main card */}
        <div className="card" style={{ animation: 'fadeInUp 0.45s var(--ease-out) both' }}>
          <div className="card-header">
            <div>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 4 }}>File Compressor</h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', margin: 0 }}>Upload a file and choose compression strength</p>
            </div>
            <Minimize2 size={20} style={{ color: 'var(--accent-primary)' }} />
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>

            {/* Done state */}
            {status === 'done' && result && (
              <div className="conversion-result">
                <div className="conversion-result__icon"><CheckCircle /></div>
                <h3 className="conversion-result__title">Compressed!</h3>
                <p className="conversion-result__desc">
                  <strong style={{ color: 'var(--text-primary)' }}>{result.filename}</strong> downloaded.
                </p>
                <div style={{
                  display: 'flex',
                  gap: 'var(--sp-4)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-base)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--sp-4) var(--sp-6)',
                  marginTop: 'var(--sp-2)',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Original</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>{formatBytes(result.originalSize)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-tertiary)', fontSize: 20 }}>→</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Compressed</div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'var(--emerald-400)' }}>{formatBytes(result.compressedSize)}</div>
                  </div>
                  {savingPct > 0 && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginBottom: 4 }}>Saved</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--emerald-400)' }}>{savingPct}%</div>
                    </div>
                  )}
                </div>
                <button className="btn btn--primary" onClick={reset} style={{ marginTop: 'var(--sp-2)' }}>
                  <Minimize2 size={16} /> Compress Another
                </button>
              </div>
            )}

            {/* Error state */}
            {status === 'error' && (
              <div className="conversion-result">
                <div className="conversion-result__icon" style={{ background: 'var(--error-bg)', borderColor: 'rgba(244,63,94,0.3)', color: 'var(--error)', animation: 'none' }}>
                  <AlertCircle />
                </div>
                <h3 className="conversion-result__title">Compression Failed</h3>
                <p className="conversion-result__desc">{error}</p>
                <button className="btn btn--secondary" onClick={reset}><RotateCcw size={16} /> Try Again</button>
              </div>
            )}

            {/* Input state */}
            {status !== 'done' && status !== 'error' && (
              <>
                {/* Drop zone or file preview */}
                {!file ? (
                  <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone--active' : ''}`}>
                    <input {...getInputProps()} />
                    <div className="dropzone__content">
                      <UploadCloud className="dropzone__icon" />
                      <h3 className="dropzone__title">{isDragActive ? 'Drop it here' : 'Drag & drop your file'}</h3>
                      <p className="dropzone__subtitle">or <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>browse</span> to choose</p>
                      <div className="dropzone__formats">
                        {['PDF', 'JPG', 'PNG', 'WEBP', 'TXT'].map(f => (
                          <span key={f} className="badge badge--neutral">{f}</span>
                        ))}
                      </div>
                      <p style={{ marginTop: 'var(--sp-3)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>Max 50 MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="file-preview">
                    <div className="file-preview__icon">{emoji}</div>
                    <div className="file-preview__info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">
                        <span className={`badge badge--${getExtension(file.name)}`} style={{ marginRight: 6 }}>{label}</span>
                        {formatBytes(file.size)}
                      </div>
                    </div>
                    <div className="file-preview__actions">
                      <button className="btn btn--ghost btn--sm" onClick={reset}><X size={16} /></button>
                    </div>
                  </div>
                )}

                {/* Unsupported warning */}
                {file && !isSupported && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)', padding: 'var(--sp-4)', background: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 'var(--radius-md)', color: 'var(--warning)', fontSize: 'var(--text-sm)' }}>
                    <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>Compression not supported for <strong>{ext}</strong> files. Supported: .pdf, .jpg, .jpeg, .png, .webp, .txt</span>
                  </div>
                )}

                {/* Quality slider */}
                {file && isSupported && !isLoading && (
                  <QualitySlider value={quality} onChange={setQuality} />
                )}

                {/* Progress */}
                {isLoading && <ProgressBar progress={progress} status={status === 'uploading' ? 'uploading' : 'converting'} />}

                {/* Compress button */}
                {file && isSupported && !isLoading && (
                  <button
                    className="btn btn--primary btn--lg"
                    onClick={compress}
                    style={{ width: '100%' }}
                  >
                    <Minimize2 size={18} />
                    Compress File ({Math.round(quality * 100)}% quality)
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)', animation: 'fadeInUp 0.45s var(--ease-out) 0.1s both' }}>
          <div className="card card--accent">
            <div className="card-body">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--sp-4)', color: 'var(--text-primary)' }}>Supported Formats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {[
                  { ext: 'PDF', desc: 'Removes metadata, compresses streams', cls: 'pdf' },
                  { ext: 'JPG / JPEG', desc: 'MozJPEG re-encoding', cls: 'pdf' },
                  { ext: 'PNG', desc: 'Adaptive filtering + compression', cls: 'txt' },
                  { ext: 'WEBP', desc: 'Quality re-encode', cls: 'docx' },
                  { ext: 'TXT', desc: 'Whitespace & blank line cleanup', cls: 'txt' },
                ].map(({ ext: e, desc, cls }) => (
                  <div key={e} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span className={`badge badge--${cls}`} style={{ alignSelf: 'flex-start' }}>{e}</span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--sp-3)', color: 'var(--text-primary)' }}>Quality Guide</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
                {[
                  { range: '10–30%', label: 'Max Compression', color: 'var(--rose-400)', desc: 'Smallest size, noticeable quality loss' },
                  { range: '50–70%', label: 'Balanced', color: 'var(--amber-400)', desc: 'Great for web & email sharing' },
                  { range: '80–100%', label: 'High Quality', color: 'var(--emerald-400)', desc: 'Near original quality, minimal size reduction' },
                ].map(({ range, label, color, desc }) => (
                  <div key={range} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-2)' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-primary)' }}>{range} — {label}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
