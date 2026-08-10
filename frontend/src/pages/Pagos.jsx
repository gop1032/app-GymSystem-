import React, { useState } from 'react'
import { DollarSign, Search, CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react'

// Datos simulados
const MOCK_PAGOS = [
  { id: 1, client: 'Juan Pérez', plan: 'Plan Mensual', amount: 80, date: '2026-08-01', status: 'PAID' },
  { id: 2, client: 'María López', plan: 'Plan Trimestral', amount: 210, date: '2026-08-05', status: 'PAID' },
  { id: 3, client: 'Carlos Vega', plan: 'Plan Semestral', amount: 390, date: '2026-08-07', status: 'PENDING' },
  { id: 4, client: 'Ana Torres', plan: 'Plan Mensual', amount: 80, date: '2026-08-08', status: 'FAILED' },
]

export default function Pagos() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_PAGOS.filter(p => p.client.toLowerCase().includes(search.toLowerCase()))

  const getStatus = (status) => {
    switch (status) {
      case 'PAID': return { label: 'Pagado', bg: 'rgba(16,185,129,0.1)', text: '#10b981', icon: <CheckCircle2 size={14} /> }
      case 'PENDING': return { label: 'Pendiente', bg: 'rgba(251,191,36,0.1)', text: '#fbbf24', icon: <Clock size={14} /> }
      case 'FAILED': return { label: 'Rechazado', bg: 'rgba(239,68,68,0.1)', text: '#ef4444', icon: <XCircle size={14} /> }
      default: return { label: 'Desconocido', bg: 'rgba(107,114,128,0.1)', text: '#6b7280', icon: <Clock size={14} /> }
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>Finanzas</p>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Historial de Pagos</h1>
        </div>
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

      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Cliente</th>
              <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Plan</th>
              <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Monto</th>
              <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Fecha</th>
              <th style={{ padding: '16px', color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(pago => {
              const st = getStatus(pago.status)
              return (
                <tr key={pago.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.2s' }}>
                  <td style={{ padding: '16px', color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{pago.client}</td>
                  <td style={{ padding: '16px', color: '#d1d5db', fontSize: '0.9rem' }}>{pago.plan}</td>
                  <td style={{ padding: '16px', color: '#fbbf24', fontSize: '1rem', fontWeight: 900 }}>S/. {pago.amount.toFixed(2)}</td>
                  <td style={{ padding: '16px', color: '#9ca3af', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} /> {pago.date}
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: st.bg, color: st.text, padding: '6px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {st.icon} {st.label}
                    </span>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                  No se encontraron pagos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
