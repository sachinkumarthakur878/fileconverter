// Format bytes to human readable
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

// Format date
export function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Format relative time
export function formatRelativeTime(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const d = new Date(dateStr)
  const diff = now - d
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return formatDate(dateStr)
}

// Get file extension
export function getExtension(filename) {
  if (!filename) return ''
  return filename.split('.').pop().toLowerCase()
}

// Get file type emoji / label
export function getFileTypeInfo(fileType) {
  const map = {
    pdf:  { emoji: '📄', label: 'PDF',  color: 'rose' },
    docx: { emoji: '📝', label: 'DOCX', color: 'indigo' },
    doc:  { emoji: '📝', label: 'DOC',  color: 'indigo' },
    txt:  { emoji: '📃', label: 'TXT',  color: 'emerald' },
    html: { emoji: '🌐', label: 'HTML', color: 'amber' },
    jpg:  { emoji: '🖼️', label: 'JPG',  color: 'violet' },
    jpeg: { emoji: '🖼️', label: 'JPEG', color: 'violet' },
    png:  { emoji: '🖼️', label: 'PNG',  color: 'violet' },
    gif:  { emoji: '🎞️', label: 'GIF',  color: 'violet' },
    webp: { emoji: '🖼️', label: 'WEBP', color: 'violet' },
  }
  return map[fileType?.toLowerCase()] || { emoji: '📁', label: fileType?.toUpperCase() || 'FILE', color: 'neutral' }
}

// Get user initials
export function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// Validate email
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
