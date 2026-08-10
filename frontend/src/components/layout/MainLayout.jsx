import React, { useState } from 'react'
import Navbar from '../ui/Navbar'
import Sidebar from '../ui/Sidebar'

export default function MainLayout({ children }) {
  const [open, setOpen] = useState(true)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#030712' }}>
      {open && <Sidebar />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar onToggle={() => setOpen(s => !s)} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
