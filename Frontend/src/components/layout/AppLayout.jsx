import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopHeader from './TopHeader'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/convert': 'Convert Files',
  '/my-files': 'My Files',
  '/upload': 'Upload',
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'FileForge'

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="main-content">
        <TopHeader
          title={title}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />
        <Outlet />
      </div>
    </div>
  )
}
