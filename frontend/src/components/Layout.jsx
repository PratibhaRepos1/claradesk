import { Outlet } from 'react-router-dom'

import Sidebar from './Sidebar.jsx'

export default function Layout() {
  return (
    <div className="min-h-full bg-clara-cream text-clara-ink">
      <div className="mx-auto flex max-w-7xl">
        <Sidebar />
        <main className="flex-1 px-6 py-10 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
