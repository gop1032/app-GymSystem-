import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../config/api'
import Swal from 'sweetalert2'
import { Users, Search, Phone, Mail, UserCheck, UserX, Plus, Eye, Dumbbell } from 'lucide-react'

const STATUS_COLORS = {
  ACTIVE:    { bg: 'rgba(5,150,105,0.1)',  text: '#059669', label: 'Activo'    },
  INACTIVE:  { bg: 'rgba(107,114,128,0.1)', text: '#6b7280', label: 'Inactivo' },
  SUSPENDED: { bg: 'rgba(220,38,38,0.1)',  text: '#dc2626', label: 'Suspendido'},
}

function ClientCard({ client, canEdit, onEdit, onDelete, onViewSchedule }) {
  const st = STATUS_COLORS[client.status] || STATUS_COLORS.INACTIVE
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', padding: '1.5rem', transition: 'all 0.2s'
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(251,191,36,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #fbbf24, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 900, color: '#030712', flexShrink: 0
          }}>
            {client.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>{client.name}</p>
            <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>DNI: {client.dni}</p>
          </div>
        </div>
        <span style={{
          padding: '3px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
          background: st.bg, color: st.text
        }}>{st.label}</span>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
        {client.email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={13} color="#4b5563" />
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={13} color="#4b5563" />
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>{client.phone}</span>
          </div>
        )}
        {client.trainer && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Dumbbell size={13} color="#fbbf24" />
            <span style={{ color: '#fbbf24', fontSize: '0.8rem', fontWeight: 600 }}>
              Entrenador: {client.trainer?.user?.name || client.trainer?.specialty || '—'}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onViewSchedule(client)}
          style={{
            flex: 1, padding: '8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
            background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
            color: '#fbbf24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
          }}
        >
          <Eye size={13} /> Ver Horario
        </button>
        {canEdit && (
          <>
            <button
              onClick={() => onEdit(client)}
              style={{
                flex: 1, padding: '8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)',
                color: '#3b82f6', cursor: 'pointer'
              }}
            >Editar</button>
            <button
              onClick={() => onDelete(client)}
              style={{
                padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700,
                background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)',
                color: '#ef4444', cursor: 'pointer'
              }}
            >✕</button>
          </>
        )}
      </div>
    </div>
  )
}

function AddClientModal({ trainers, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', dni: '', trainerId: '' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try { await onSave(form); onClose() }
    catch (err) { Swal.fire({ icon: 'error', title: 'Error', text: err?.response?.data?.message || err.message, background: '#111827', color: '#fff' }) }
    finally { setSaving(false) }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '0.9rem',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff', boxSizing: 'border-box'
  }
  const labelStyle = { color: '#9ca3af', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px', display: 'block' }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '480px'
      }}>
        <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', marginBottom: '1.5rem' }}>➕ Nuevo Cliente</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div><label style={labelStyle}>Nombre completo *</label>
            <input style={inputStyle} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: María López" /></div>
          <div><label style={labelStyle}>DNI *</label>
            <input style={inputStyle} required value={form.dni} onChange={e => setForm(f => ({ ...f, dni: e.target.value }))} placeholder="12345678" /></div>
          <div><label style={labelStyle}>Teléfono *</label>
            <input style={inputStyle} required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="999 888 777" /></div>
          <div><label style={labelStyle}>Correo electrónico</label>
            <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="cliente@mail.com" /></div>
          <div><label style={labelStyle}>Entrenador asignado</label>
            <select style={inputStyle} value={form.trainerId} onChange={e => setForm(f => ({ ...f, trainerId: e.target.value }))}>
              <option value="">Sin asignar</option>
              {trainers.map(t => <option key={t.id} value={t.id}>{t.user?.name || t.specialty}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', fontWeight: 700, cursor: 'pointer' }}>Cancelar</button>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg,#fbbf24,#d97706)', color: '#030712', fontWeight: 800, cursor: 'pointer', border: 'none' }}>
              {saving ? 'Guardando...' : 'Registrar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ScheduleModal({ client, onClose }) {
  const WORKOUT_SCHEDULE = [
    { day: 'Lunes',     time: '7:00 AM',  activity: 'Musculación – Pecho y Tríceps',     duration: '60 min', type: 'fuerza' },
    { day: 'Martes',    time: '7:00 AM',  activity: 'Cardio HIIT – Caminadora y Elíptica', duration: '45 min', type: 'cardio' },
    { day: 'Miércoles', time: '7:00 AM',  activity: 'Musculación – Espalda y Bíceps',    duration: '60 min', type: 'fuerza' },
    { day: 'Jueves',    time: '7:00 AM',  activity: 'Funcional – Core y Abdomen',         duration: '45 min', type: 'funcional' },
    { day: 'Viernes',   time: '7:00 AM',  activity: 'Musculación – Piernas y Glúteos',   duration: '60 min', type: 'fuerza' },
    { day: 'Sábado',    time: '9:00 AM',  activity: 'Cardio – Maratón de Clases',         duration: '90 min', type: 'cardio' },
    { day: 'Domingo',   time: '—',        activity: 'Descanso activo / Flexibilidad',      duration: '—',      type: 'descanso' },
  ]

  const typeColors = {
    fuerza:    { bg: 'rgba(37,99,235,0.1)',   text: '#3b82f6',  label: '💪 Fuerza'    },
    cardio:    { bg: 'rgba(5,150,105,0.1)',   text: '#059669',  label: '🏃 Cardio'    },
    funcional: { bg: 'rgba(124,58,237,0.1)', text: '#8b5cf6',  label: '⚡ Funcional'  },
    descanso:  { bg: 'rgba(107,114,128,0.1)', text: '#6b7280', label: '😴 Descanso'  },
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#0d1629', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Horario de Entrenamiento</p>
            <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', marginTop: '2px' }}>{client.name}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#9ca3af', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>✕ Cerrar</button>
        </div>

        {/* Trainer info */}
        {client.trainer && (
          <div style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '14px', padding: '12px 16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Dumbbell size={18} color="#fbbf24" />
            <div>
              <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.85rem' }}>Entrenador Asignado</p>
              <p style={{ color: '#d1d5db', fontSize: '0.8rem' }}>{client.trainer?.user?.name || client.trainer?.specialty}</p>
            </div>
          </div>
        )}

        {/* Weekly schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {WORKOUT_SCHEDULE.map((item, i) => {
            const tc = typeColors[item.type]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: '80px', flexShrink: 0 }}>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>{item.day}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.72rem' }}>{item.time}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#f3f4f6', fontWeight: 600, fontSize: '0.85rem' }}>{item.activity}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.72rem', marginTop: '2px' }}>Duración: {item.duration}</p>
                </div>
                <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, background: tc.bg, color: tc.text, whiteSpace: 'nowrap' }}>
                  {tc.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Notes */}
        <div style={{ marginTop: '1.5rem', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '14px', padding: '1rem' }}>
          <p style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px' }}>📋 Indicaciones del Entrenador</p>
          <ul style={{ color: '#9ca3af', fontSize: '0.8rem', lineHeight: 1.7, paddingLeft: '16px' }}>
            <li>Calentamiento de 10 min antes de cada sesión</li>
            <li>Hidratación constante durante el entrenamiento</li>
            <li>Estiramientos de 5–10 min al finalizar</li>
            <li>Respetar los días de descanso para recuperación muscular</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function Clientes() {
  const { user } = useContext(AuthContext)
  const role = user?.role
  // Entrenador y Nutricionista solo ven, no registran ni eliminan
  const canEdit   = role === 'ADMIN' || role === 'RECEPTIONIST'
  const canDelete = role === 'ADMIN'

  const [clients, setClients]             = useState([])
  const [trainers, setTrainers]           = useState([])
  const [loading, setLoading]             = useState(true)
  const [search, setSearch]               = useState('')
  const [showAdd, setShowAdd]             = useState(false)
  const [scheduleClient, setScheduleClient] = useState(null)
  const [filterStatus, setFilterStatus]   = useState('ALL')

  const loadData = async () => {
    setLoading(true)
    try {
      const [{ data: cd }, { data: td }] = await Promise.all([
        api.get('/clients'),
        api.get('/trainers')
      ])
      setClients(cd.data || [])
      setTrainers(td.data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData() }, [])

  const handleSave = async (form) => {
    await api.post('/clients', form)
    await loadData()
    Swal.fire({ icon: 'success', title: 'Cliente registrado', timer: 1200, showConfirmButton: false, background: '#111827', color: '#fff' })
  }

  const handleEdit = async (client) => {
    const { value: newName } = await Swal.fire({
      title: 'Editar cliente',
      input: 'text',
      inputValue: client.name,
      inputLabel: 'Nombre completo',
      showCancelButton: true,
      confirmButtonColor: '#fbbf24',
      background: '#111827',
      color: '#fff'
    })
    if (!newName) return
    try {
      await api.put(`/clients/${client.id}`, { name: newName })
      await loadData()
      Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1000, showConfirmButton: false, background: '#111827', color: '#fff' })
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: e?.response?.data?.message || e.message, background: '#111827', color: '#fff' })
    }
  }

  const handleDelete = async (client) => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${client.name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning', showCancelButton: true,
      confirmButtonColor: '#ef4444', confirmButtonText: 'Sí, eliminar',
      background: '#111827', color: '#fff'
    })
    if (!result.isConfirmed) return
    try {
      await api.delete(`/clients/${client.id}`)
      await loadData()
      Swal.fire({ icon: 'success', title: 'Eliminado', timer: 1000, showConfirmButton: false, background: '#111827', color: '#fff' })
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error', text: e?.response?.data?.message || e.message, background: '#111827', color: '#fff' })
    }
  }

  const filtered = clients
    .filter(c => filterStatus === 'ALL' || c.status === filterStatus)
    .filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.dni?.includes(search) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    )

  const stats = {
    total:     clients.length,
    active:    clients.filter(c => c.status === 'ACTIVE').length,
    suspended: clients.filter(c => c.status === 'SUSPENDED').length,
    inactive:  clients.filter(c => c.status === 'INACTIVE').length,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#030712', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>
              {role === 'TRAINER' ? 'Solo lectura' : role === 'NUTRITIONIST' ? 'Mis Pacientes' : 'Gestión'}
            </p>
            <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>
              {role === 'TRAINER' ? 'Mis Alumnos' : role === 'NUTRITIONIST' ? 'Pacientes' : 'Clientes'}
            </h1>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowAdd(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 20px', borderRadius: '12px',
                background: 'linear-gradient(135deg,#fbbf24,#d97706)',
                color: '#030712', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer'
              }}
            >
              <Plus size={18} /> Nuevo Cliente
            </button>
          )}
        </div>

        {/* KPI Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total', value: stats.total, color: '#fbbf24', icon: '👥' },
            { label: 'Activos', value: stats.active, color: '#059669', icon: '✅' },
            { label: 'Suspendidos', value: stats.suspended, color: '#dc2626', icon: '⚠️' },
            { label: 'Inactivos', value: stats.inactive, color: '#6b7280', icon: '💤' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 600 }}>{s.label}</p>
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
              </div>
              <p style={{ color: s.color, fontSize: '2rem', fontWeight: 900, marginTop: '8px' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#4b5563' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, DNI o email..."
              style={{ width: '100%', paddingLeft: '42px', paddingRight: '14px', paddingTop: '11px', paddingBottom: '11px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box' }}
            />
          </div>
          {['ALL', 'ACTIVE', 'SUSPENDED', 'INACTIVE'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} style={{
              padding: '10px 16px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', border: 'none',
              background: filterStatus === s ? 'linear-gradient(135deg,#fbbf24,#d97706)' : 'rgba(255,255,255,0.05)',
              color: filterStatus === s ? '#030712' : '#9ca3af'
            }}>
              {s === 'ALL' ? 'Todos' : s === 'ACTIVE' ? 'Activos' : s === 'SUSPENDED' ? 'Suspendidos' : 'Inactivos'}
            </button>
          ))}
        </div>

        {/* Grid de clientes */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#374151', paddingTop: '4rem', fontSize: '1rem' }}>Cargando clientes...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#374151' }}>
            <Users size={40} style={{ margin: '0 auto 12px', opacity: .4 }} />
            <p style={{ fontWeight: 700 }}>No se encontraron clientes</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {filtered.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                canEdit={canEdit}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewSchedule={setScheduleClient}
              />
            ))}
          </div>
        )}
      </div>

      {showAdd && <AddClientModal trainers={trainers} onSave={handleSave} onClose={() => setShowAdd(false)} />}
      {scheduleClient && <ScheduleModal client={scheduleClient} onClose={() => setScheduleClient(null)} />}
    </div>
  )
}
