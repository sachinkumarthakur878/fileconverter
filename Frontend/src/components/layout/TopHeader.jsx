import { Menu } from 'lucide-react'
import ThemeToggle from '../common/ThemeToggle'

export default function TopHeader({ title, onMenuClick }) {
  return (
    <header className="top-header">
      <div className="top-header__left">
        <button
          className="top-header__menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        {title && <h1 className="top-header__title">{title}</h1>}
      </div>

      <div className="top-header__right">
        <ThemeToggle />
      </div>
    </header>
  )
}
