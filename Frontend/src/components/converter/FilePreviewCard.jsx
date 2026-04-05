import { X } from 'lucide-react'
import { formatBytes, getFileTypeInfo, getExtension } from '../../utils/helpers'

export default function FilePreviewCard({ file, onRemove }) {
  if (!file) return null
  const ext = getExtension(file.name)
  const { emoji, label } = getFileTypeInfo(ext)

  return (
    <div className="file-preview">
      <div className="file-preview__icon">
        {emoji}
      </div>
      <div className="file-preview__info">
        <div className="file-name">{file.name}</div>
        <div className="file-size">
          <span className={`badge badge--${ext}`} style={{ marginRight: 6 }}>{label}</span>
          {formatBytes(file.size)}
        </div>
      </div>
      <div className="file-preview__actions">
        <button
          className="btn btn--ghost btn--sm"
          onClick={onRemove}
          title="Remove file"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
