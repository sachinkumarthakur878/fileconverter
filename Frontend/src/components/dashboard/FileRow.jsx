import { Trash2 } from 'lucide-react'
import { formatBytes, formatRelativeTime, getFileTypeInfo } from '../../utils/helpers'
import { useState } from 'react'

export default function FileRow({ file, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const typeInfo = getFileTypeInfo(file.fileType)

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${file.originalName}"?`)) return
    setDeleting(true)
    await onDelete(file._id)
    setDeleting(false)
  }

  return (
    <tr>
      <td>
        <div className="file-name-cell">
          <div className="file-icon">{typeInfo.emoji}</div>
          <span className="file-name-text" title={file.originalName}>
            {file.originalName}
          </span>
        </div>
      </td>
      <td>
        <span className={`badge badge--${file.fileType?.toLowerCase()}`}>
          {typeInfo.label}
        </span>
      </td>
      <td>{formatBytes(file.size)}</td>
      <td>{formatRelativeTime(file.createdAt)}</td>
      <td>
        <div className="file-actions">
          <button
            className="btn btn--danger btn--sm"
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
          >
            <Trash2 size={14} />
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  )
}
