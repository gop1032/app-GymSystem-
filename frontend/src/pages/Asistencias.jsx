import React, { useState } from 'react'
import { CheckCircle2, Clock, Search, User, QrCode } from 'lucide-react'

const MOCK_ASISTENCIAS = [
  { id: 1, client: 'Juan Pérez', time: '08:30 AM', status: 'ON_TIME' },
  { id: 2, client: 'María López', time: '09:15 AM', status: 'LATE' },
  { id: 3, client: 'Carlos Vega', time: '18:00 PM', status: 'ON_TIME' },
]

export default function Asistencias() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_ASISTENCIAS.filter(a => a.client.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>Recepción</p>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Asistencias de Hoy</h1>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px',
          background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer'
        }}>
          <QrCode size={18} /> Escanear QR
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cliente..."
            style={{ width: '100%', paddingLeft: '42px', paddingRight: '14px', paddingTop: '11px', paddingBottom: '11px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280', gridColumn: '1 / -1' }}>
            No hay asistencias registradas aún.
          </div>
        ) : (
          filtered.map(a => (
            <div key={a.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(251,191,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="#fbbf24" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{a.client}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '0.8rem', marginTop: '4px' }}>
                  <Clock size={12} /> {a.time}
                </div>
              </div>
              {a.status === 'ON_TIME' ? (
                <CheckCircle2 size={24} color="#10b981" />
              ) : (
                <Clock size={24} color="#fbbf24" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
