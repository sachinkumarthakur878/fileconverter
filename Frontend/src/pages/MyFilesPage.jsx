import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Files, Search, ArrowRightLeft, SlidersHorizontal, RefreshCw } from 'lucide-react'
import { useFiles } from '../hooks/useFiles'
import FileRow from '../components/dashboard/FileRow'

const FILE_TYPES = ['all', 'pdf', 'docx', 'doc', 'txt', 'jpg', 'png']

export default function MyFilesPage() {
  const navigate = useNavigate()
  const { files, loading, fetched, fetchFiles, deleteFile } = useFiles()

  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    if (!fetched) fetchFiles()
  }, [fetched, fetchFiles])

  const filtered = useMemo(() => {
    let result = [...files]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(f =>
        f.originalName?.toLowerCase().includes(q) ||
        f.fileType?.toLowerCase().includes(q)
      )
    }

    if (filterType !== 'all') {
      result = result.filter(f => f.fileType === filterType)
    }

    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    else if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    else if (sortBy === 'name') result.sort((a, b) => a.originalName.localeCompare(b.originalName))
    else if (sortBy === 'size') result.sort((a, b) => b.size - a.size)

    return result
  }, [files, search, filterType, sortBy])

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="page-header__eyebrow">Library</div>
        <h1 className="page-header__title">
          My <span>Files</span>
        </h1>
        <p className="page-header__description">
          All your uploaded and converted files in one place.
        </p>
      </div>

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: 'var(--sp-3)',
        marginBottom: 'var(--sp-6)',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        {/* Search */}
        <div className="input-wrapper" style={{ flex: '1', minWidth: 200, maxWidth: 360 }}>
          <Search className="input-icon" size={16} />
          <input
            type="text"
            className="input"
            placeholder="Search files…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          {FILE_TYPES.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`btn btn--sm ${filterType === t ? 'btn--primary' : 'btn--secondary'}`}
            >
              {t === 'all' ? 'All Types' : t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="input"
          style={{ width: 'auto', paddingLeft: 'var(--sp-3)' }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">Name A–Z</option>
          <option value="size">Largest First</option>
        </select>

        <button className="btn btn--ghost btn--sm" onClick={fetchFiles} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'btn__spinner' : ''} />
          Refresh
        </button>
      </div>

      {/* Results count */}
      <div style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--text-tertiary)',
        marginBottom: 'var(--sp-4)',
      }}>
        {loading ? 'Loading…' : `${filtered.length} file${filtered.length !== 1 ? 's' : ''}`}
        {(search || filterType !== 'all') && ` matching filters`}
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 'var(--sp-8)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="skeleton" style={{ height: 52, borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <Files size={28} />
              </div>
              <div className="empty-state__title">
                {search || filterType !== 'all' ? 'No matching files' : 'No files yet'}
              </div>
              <p className="empty-state__description">
                {search || filterType !== 'all'
                  ? 'Try adjusting your search or filter.'
                  : 'Upload or convert a file to see it here.'}
              </p>
              {!search && filterType === 'all' && (
                <button className="btn btn--primary" onClick={() => navigate('/convert')}>
                  <ArrowRightLeft size={16} />
                  Convert a File
                </button>
              )}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="files-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(file => (
                    <FileRow key={file._id} file={file} onDelete={deleteFile} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
