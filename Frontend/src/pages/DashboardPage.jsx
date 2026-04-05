import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Files, FileText, FileType, Upload, ArrowRightLeft, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useFiles } from '../hooks/useFiles'
import StatCard from '../components/dashboard/StatCard'
import FileRow from '../components/dashboard/FileRow'

export default function DashboardPage() {
  const { user } = useAuth()
  const { files, loading, fetched, fetchFiles, deleteFile } = useFiles()
  const navigate = useNavigate()

  useEffect(() => {
    if (!fetched) fetchFiles()
  }, [fetched, fetchFiles])

  const stats = useMemo(() => {
    const pdfs = files.filter(f => f.fileType === 'pdf').length
    const docs = files.filter(f => ['docx','doc'].includes(f.fileType)).length
    const txts = files.filter(f => f.fileType === 'txt').length
    return { total: files.length, pdfs, docs, txts }
  }, [files])

  const recentFiles = files.slice(0, 5)

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__eyebrow">Overview</div>
        <h1 className="page-header__title">
          Welcome back, <span>{user?.name?.split(' ')[0] || 'there'}</span>
        </h1>
        <p className="page-header__description">
          Your file conversion dashboard. Convert documents, manage files, and track your activity.
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 'var(--sp-3)', marginBottom: 'var(--sp-8)', flexWrap: 'wrap' }}>
        <button className="btn btn--primary" onClick={() => navigate('/convert')}>
          <ArrowRightLeft size={16} />
          Convert File
        </button>
        <button className="btn btn--secondary" onClick={() => navigate('/upload')}>
          <Upload size={16} />
          Upload File
        </button>
        <button className="btn btn--secondary" onClick={() => navigate('/my-files')}>
          <Files size={16} />
          View All Files
        </button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--sp-8)' }}>
        <StatCard
          icon={Files}
          value={loading ? '—' : stats.total}
          label="Total Files"
          colorClass="indigo"
          delay={0}
        />
        <StatCard
          icon={FileText}
          value={loading ? '—' : stats.pdfs}
          label="PDF Files"
          colorClass="rose"
          delay={80}
        />
        <StatCard
          icon={FileType}
          value={loading ? '—' : stats.docs}
          label="Word Documents"
          colorClass="violet"
          delay={160}
        />
        <StatCard
          icon={Zap}
          value={loading ? '—' : stats.txts}
          label="Text Files"
          colorClass="emerald"
          delay={240}
        />
      </div>

      {/* Recent Files */}
      <div className="card" style={{ animation: 'fadeInUp 0.5s var(--ease-out) 0.3s both' }}>
        <div className="card-header">
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 4 }}>
              Recent Files
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', margin: 0 }}>
              Your 5 most recent uploads and conversions
            </p>
          </div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/my-files')}>
            View all →
          </button>
        </div>

        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ padding: 'var(--sp-8)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {[1,2,3].map(i => (
                <div key={i} className="skeleton" style={{ height: 48, borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : recentFiles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon"><Files size={28} /></div>
              <div className="empty-state__title">No files yet</div>
              <p className="empty-state__description">
                Upload or convert your first file to get started.
              </p>
              <button className="btn btn--primary" onClick={() => navigate('/convert')}>
                <ArrowRightLeft size={16} />
                Convert a File
              </button>
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
                  {recentFiles.map(file => (
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
