import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'
import { ALLOWED_MIME_TYPES } from '../../hooks/useConverter'

const MAX_SIZE = 50 * 1024 * 1024 // 50MB

export default function DropZone({ onFile, accept, disabled }) {
  const onDrop = useCallback((accepted, rejected) => {
    if (accepted.length > 0) {
      onFile(accepted[0])
    }
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept || {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: MAX_SIZE,
    disabled,
  })

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'dropzone--active' : ''} ${disabled ? 'dropzone--disabled' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="dropzone__content">
        <UploadCloud className="dropzone__icon" />
        <h3 className="dropzone__title">
          {isDragActive ? 'Drop your file here' : 'Drag & drop your file'}
        </h3>
        <p className="dropzone__subtitle">
          or <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>browse</span> to choose a file
        </p>
        <div className="dropzone__formats">
          {['.PDF', '.DOCX', '.DOC', '.TXT'].map(fmt => (
            <span key={fmt} className="badge badge--neutral">{fmt}</span>
          ))}
        </div>
        <p style={{ marginTop: 'var(--sp-3)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
          Max file size: 50 MB
        </p>
      </div>
    </div>
  )
}
