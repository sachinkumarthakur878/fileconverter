import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, CheckCircle, AlertCircle, X, UploadCloud, ArrowRightLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fileAPI } from '../api'
import { formatBytes, getFileTypeInfo, getExtension } from '../utils/helpers'
import { ALLOWED_MIME_TYPES } from '../hooks/useConverter'
import ProgressBar from '../components/converter/ProgressBar'
import toast from 'react-hot-toast'

const MAX_SIZE = 50 * 1024 * 1024

function FileUploadItem({ item, onRemove }) {
  const ext = getExtension(item.file.name)
  const { emoji, label } = getFileTypeInfo(ext)

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--sp-3)',
      padding: 'var(--sp-4)',
      background: 'var(--bg-elevated)',
      borderRadius: 'var(--radius-lg)',
      border: `1px solid ${
        item.status === 'done' ? 'rgba(16,185,129,0.25)' :
        item.status === 'error' ? 'rgba(244,63,94,0.25)' :
        'var(--border-base)'
      }`,
      transition: 'all var(--duration-base)',
    }}>
      <div style={{ fontSize: 24, flexShrink: 0 }}>{emoji}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {item.file.name}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginTop: 4 }}>
          <span className={`badge badge--${ext}`}>{label}</span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
            {formatBytes(item.file.size)}
          </span>
        </div>
        {(item.status === 'uploading') && (
          <div style={{ marginTop: 'var(--sp-2)' }}>
            <ProgressBar progress={item.progress} status="uploading" />
          </div>
        )}
        {item.status === 'error' && (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--error)', marginTop: 4 }}>
            {item.error}
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
        {item.status === 'done' && <CheckCircle size={18} style={{ color: 'var(--success)' }} />}
        {item.status === 'error' && <AlertCircle size={18} style={{ color: 'var(--error)' }} />}
        {(item.status === 'idle' || item.status === 'error') && (
          <button className="btn btn--ghost btn--sm" onClick={() => onRemove(item.id)}>
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function UploadPage() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState([]) // { id, file, status, progress, error }
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((accepted) => {
    const newItems = accepted.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      status: 'idle',
      progress: 0,
      error: '',
    }))
    setQueue(prev => [...prev, ...newItems])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_SIZE,
    disabled: uploading,
  })

  const removeItem = (id) => setQueue(prev => prev.filter(i => i.id !== id))
  const clearDone = () => setQueue(prev => prev.filter(i => i.status !== 'done'))

  const uploadAll = async () => {
    const pending = queue.filter(i => i.status === 'idle' || i.status === 'error')
    if (pending.length === 0) return
    setUploading(true)

    for (const item of pending) {
      setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'uploading', progress: 0 } : i))
      try {
        await fileAPI.upload(item.file, (p) => {
          setQueue(prev => prev.map(i => i.id === item.id ? { ...i, progress: p } : i))
        })
        setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'done', progress: 100 } : i))
        toast.success(`Uploaded: ${item.file.name}`)
      } catch (err) {
        const msg = err.response?.data?.message || 'Upload failed'
        setQueue(prev => prev.map(i => i.id === item.id ? { ...i, status: 'error', error: msg } : i))
      }
    }

    setUploading(false)
  }

  const pendingCount = queue.filter(i => i.status === 'idle' || i.status === 'error').length
  const doneCount = queue.filter(i => i.status === 'done').length

  return (
    <div className="page-wrapper" style={{ maxWidth: 720 }}>
      <div className="page-header">
        <div className="page-header__eyebrow">Files</div>
        <h1 className="page-header__title">
          Upload <span>Files</span>
        </h1>
        <p className="page-header__description">
          Upload files to your library. Supports PDF, Word, text, and image files up to 50MB.
        </p>
      </div>

      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'dropzone--active' : ''} ${uploading ? 'dropzone--disabled' : ''}`}
        style={{ marginBottom: 'var(--sp-6)' }}
      >
        <input {...getInputProps()} />
        <div className="dropzone__content">
          <UploadCloud className="dropzone__icon" />
          <h3 className="dropzone__title">
            {isDragActive ? 'Drop files here' : 'Drag & drop files'}
          </h3>
          <p className="dropzone__subtitle">
            or <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>browse</span> to choose files
          </p>
          <div className="dropzone__formats">
            {['PDF', 'DOCX', 'TXT', 'JPG', 'PNG', 'WEBP'].map(f => (
              <span key={f} className="badge badge--neutral">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <div className="card" style={{ animation: 'scaleIn 0.3s var(--ease-out) both' }}>
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>
                Upload Queue
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', margin: 0 }}>
                {queue.length} file{queue.length !== 1 ? 's' : ''} selected
                {doneCount > 0 && ` · ${doneCount} uploaded`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
              {doneCount > 0 && (
                <button className="btn btn--ghost btn--sm" onClick={clearDone}>
                  Clear done
                </button>
              )}
              <button className="btn btn--ghost btn--sm" onClick={() => setQueue([])}>
                Clear all
              </button>
            </div>
          </div>

          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {queue.map(item => (
              <FileUploadItem key={item.id} item={item} onRemove={removeItem} />
            ))}
          </div>

          <div className="card-footer" style={{ justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--sp-4)' }}>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => navigate('/my-files')}
            >
              View My Files →
            </button>
            <div style={{ display: 'flex', gap: 'var(--sp-3)' }}>
              <button
                className="btn btn--secondary"
                onClick={() => navigate('/convert')}
              >
                <ArrowRightLeft size={16} />
                Convert Instead
              </button>
              <button
                className={`btn btn--primary ${uploading ? 'btn--loading' : ''}`}
                onClick={uploadAll}
                disabled={uploading || pendingCount === 0}
              >
                {uploading ? (
                  <>
                    <svg className="btn__spinner" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                    Uploading…
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload {pendingCount > 0 ? `${pendingCount} File${pendingCount > 1 ? 's' : ''}` : 'All'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty hint */}
      {queue.length === 0 && (
        <div style={{
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          fontSize: 'var(--text-sm)',
          padding: 'var(--sp-6)',
        }}>
          Drop files above to add them to the upload queue
        </div>
      )}
    </div>
  )
}
