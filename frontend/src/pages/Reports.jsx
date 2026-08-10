import React, { useState, useEffect, useContext } from 'react'
import api from '../config/api'
import { AuthContext } from '../context/AuthContext'
import Swal from 'sweetalert2'
import { FileText, Download, FileSpreadsheet, Calendar, DollarSign } from 'lucide-react'

export default function Reports() {
  const { token } = useContext(AuthContext)
  const [tab, setTab] = useState('revenue') // 'revenue' or 'attendance'
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])

  const loadData = async () => {
    setLoading(true)
    try {
      const endpoint = tab === 'revenue' ? '/reports/revenue' : '/reports/attendance'
      const { data: res } = await api.get(endpoint)
      setData(res.data || [])
    } catch (error) {
      console.error(error)
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los datos del reporte', background: '#111827', color: '#fff' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [tab])

  const handleDownload = async (format) => {
    try {
      setLoading(true)
      const url = `/reports/${format}?type=${tab}`
      const response = await api.get(url, { responseType: 'blob' })
      
      const blob = new Blob([response.data])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `reporte-${tab}-${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'pdf'}`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error(error)
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo descargar el reporte', background: '#111827', color: '#fff' })
    } finally {
      setLoading(false)
    }
  }

  const thStyle = { padding: '16px', color: '#9ca3af', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid rgba(255,255,255,0.06)' }
  const tdStyle = { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.03)', color: '#d1d5db', fontSize: '0.9rem' }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>Exportación</p>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Reportes Ejecutivos</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>Descarga la información contable y de asistencias de la sede.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => handleDownload('pdf')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px',
              background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
              color: '#ef4444', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            <FileText size={16} /> Exportar PDF
          </button>
          <button
            onClick={() => handleDownload('excel')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '12px',
              background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.2)',
              color: '#10b981', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer'
            }}
          >
            <FileSpreadsheet size={16} /> Exportar Excel
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={() => setTab('revenue')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px 16px', background: 'none', border: 'none',
            borderBottom: tab === 'revenue' ? '2px solid #fbbf24' : '2px solid transparent',
            color: tab === 'revenue' ? '#fbbf24' : '#6b7280', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <DollarSign size={16} /> Reporte de Ingresos
        </button>
        <button
          onClick={() => setTab('attendance')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '0 8px 16px', background: 'none', border: 'none',
            borderBottom: tab === 'attendance' ? '2px solid #fbbf24' : '2px solid transparent',
            color: tab === 'attendance' ? '#fbbf24' : '#6b7280', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <Calendar size={16} /> Control de Asistencias
        </button>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: '#6b7280', fontWeight: 600 }}>Cargando datos...</div>
        ) : tab === 'revenue' ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Recibo</th>
                  <th style={thStyle}>Cliente</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Método</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} style={{ transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#9ca3af' }}>{item.receiptNumber}</td>
                    <td style={{ ...tdStyle, color: '#fff', fontWeight: 600 }}>{item.client?.name || 'Venta General'}</td>
                    <td style={{ ...tdStyle }}>{new Date(item.date).toLocaleDateString()}</td>
                    <td style={tdStyle}><span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.06)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>{item.method}</span></td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: '#fbbf24', fontWeight: 900 }}>S/. {Number(item.amount).toFixed(2)}</td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#6b7280' }}>No hay registros financieros.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Socio</th>
                  <th style={thStyle}>Fecha</th>
                  <th style={thStyle}>Entrada</th>
                  <th style={thStyle}>Salida</th>
                  <th style={thStyle}>Registro</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} style={{ transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ ...tdStyle, color: '#fff', fontWeight: 600 }}>{item.client?.name}</td>
                    <td style={{ ...tdStyle }}>{new Date(item.date).toLocaleDateString()}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#9ca3af' }}>{new Date(item.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', color: '#9ca3af' }}>{item.checkOut ? new Date(item.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : <span style={{ color: '#fbbf24', fontStyle: 'italic' }}>En sala</span>}</td>
                    <td style={tdStyle}><span style={{ padding: '4px 10px', background: 'rgba(5,150,105,0.1)', color: '#10b981', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>{item.source}</span></td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: '4rem', textAlign: 'center', color: '#6b7280' }}>No hay registros de asistencia.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
