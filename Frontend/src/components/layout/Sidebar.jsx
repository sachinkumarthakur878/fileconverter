import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ArrowRightLeft,
  Files,
  Upload,
  LogOut,
  Minimize2,
  FileArchive,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/convert', icon: ArrowRightLeft, label: 'Convert Files' },
  { to: '/compress', icon: Minimize2, label: 'Compress Files' },
  { to: '/my-files', icon: Files, label: 'My Files' },
  { to: '/upload', icon: Upload, label: 'Upload' },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* Logo */}
        <NavLink to="/dashboard" className="sidebar__logo" onClick={onClose}>
          <div className="logo-icon">
            <FileArchive />
          </div>
          <span className="logo-text">
            Compress<span>IO</span>
          </span>
        </NavLink>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <div className="sidebar__nav-section">
            <div className="sidebar__nav-section-label">Main</div>
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `sidebar__nav-item ${isActive ? 'active' : ''}`
                }
                onClick={onClose}
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar__footer">
          {user && (
            <div className="sidebar__user">
              <div className="user-avatar">{getInitials(user.name)}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          )}
          <button className="sidebar__nav-item" onClick={handleLogout}>
            <LogOut />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
