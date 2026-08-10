import React from 'react'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Search, Bell, Menu } from 'lucide-react'

export default function Navbar({ onToggle }) {
  const { user, logout } = useContext(AuthContext)
  const [q, setQ] = useState('')

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 24px', background: '#030712', borderBottom: '1px solid rgba(255,255,255,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onToggle} style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          padding: '8px', borderRadius: '10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center'
        }}>
          <Menu size={18} />
        </button>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar en el sistema..."
            style={{
              padding: '8px 16px 8px 36px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)', color: '#fff', width: '280px', fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button style={{ position: 'relative', background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px', background: '#dc2626', color: '#fff',
            fontSize: '0.65rem', fontWeight: 800, padding: '2px 5px', borderRadius: '999px'
          }}>3</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.2 }}>{user?.name || user?.email || 'Usuario'}</p>
            <p style={{ color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700 }}>{user?.role || 'CLIENTE'}</p>
          </div>
          <button onClick={logout} style={{
            background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
            color: '#ef4444', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer'
          }}>
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
