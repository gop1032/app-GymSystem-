import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Calendar, Clock, User, Users, Zap, Heart, Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

const CLASS_SCHEDULES = [
  { day: 'Lunes',     time: '07:00',  end: '08:30',  name: 'CrossFit Principiantes',   trainer: 'Carlos Vega',  room: 'Zona Funcional',  color: '#fbbf24', type: 'funcional', spots: 15 },
  { day: 'Lunes',     time: '09:00',  end: '10:30',  name: 'Spinning Rítmico',         trainer: 'Lucía Ramos',  room: 'Sala de Ciclismo',color: '#3b82f6', type: 'cardio',    spots: 20 },
  { day: 'Lunes',     time: '18:00',  end: '19:30',  name: 'Hipertrofia Funcional',    trainer: 'Carlos Vega',  room: 'Zona de Pesas',  color: '#8b5cf6', type: 'fuerza',    spots: 10 },
  { day: 'Lunes',     time: '20:00',  end: '21:00',  name: 'Yoga Nocturno',            trainer: 'Lucía Ramos',  room: 'Sala A',          color: '#059669', type: 'bienestar', spots: 12 },

  { day: 'Martes',    time: '08:00',  end: '09:30',  name: 'Yoga Flow',                trainer: 'Lucía Ramos',  room: 'Sala de Danza',   color: '#059669', type: 'bienestar', spots: 15 },
  { day: 'Martes',    time: '10:00',  end: '11:00',  name: 'Body Pump',                trainer: 'Carlos Vega',  room: 'Sala B',          color: '#fbbf24', type: 'fuerza',    spots: 20 },
  { day: 'Martes',    time: '19:00',  end: '20:30',  name: 'Zumba Fitness',            trainer: 'Lucía Ramos',  room: 'Sala A',          color: '#db2777', type: 'cardio',    spots: 25 },

  { day: 'Miércoles', time: '07:00',  end: '08:30',  name: 'CrossFit Intermedios',     trainer: 'Carlos Vega',  room: 'Zona Funcional',  color: '#fbbf24', type: 'funcional', spots: 12 },
  { day: 'Miércoles', time: '09:00',  end: '10:30',  name: 'Spinning Rítmico',         trainer: 'Lucía Ramos',  room: 'Sala de Ciclismo',color: '#3b82f6', type: 'cardio',    spots: 20 },
  { day: 'Miércoles', time: '18:00',  end: '19:30',  name: 'Hipertrofia Funcional',    trainer: 'Carlos Vega',  room: 'Zona de Pesas',  color: '#8b5cf6', type: 'fuerza',    spots: 10 },

  { day: 'Jueves',    time: '07:00',  end: '08:00',  name: 'Cardio Matutino',          trainer: 'Carlos Vega',  room: 'Zona Cardio',     color: '#3b82f6', type: 'cardio',    spots: 20 },
  { day: 'Jueves',    time: '08:00',  end: '09:30',  name: 'Yoga Flow',                trainer: 'Lucía Ramos',  room: 'Sala de Danza',   color: '#059669', type: 'bienestar', spots: 15 },
  { day: 'Jueves',    time: '19:00',  end: '20:30',  name: 'Zumba Fitness',            trainer: 'Lucía Ramos',  room: 'Sala A',          color: '#db2777', type: 'cardio',    spots: 25 },

  { day: 'Viernes',   time: '07:00',  end: '08:30',  name: 'CrossFit Avanzados',       trainer: 'Carlos Vega',  room: 'Zona Funcional',  color: '#dc2626', type: 'funcional', spots: 10 },
  { day: 'Viernes',   time: '09:00',  end: '10:30',  name: 'Spinning Rítmico',         trainer: 'Lucía Ramos',  room: 'Sala de Ciclismo',color: '#3b82f6', type: 'cardio',    spots: 20 },
  { day: 'Viernes',   time: '18:00',  end: '19:30',  name: 'Hipertrofia + HIIT',       trainer: 'Carlos Vega',  room: 'Zona de Pesas',  color: '#8b5cf6', type: 'fuerza',    spots: 10 },

  { day: 'Sábado',    time: '08:00',  end: '10:00',  name: 'Maratón de Cardio',        trainer: 'Carlos Vega',  room: 'Multiusos',       color: '#fbbf24', type: 'cardio',    spots: 30 },
  { day: 'Sábado',    time: '10:00',  end: '12:00',  name: 'Workshop Funcional',       trainer: 'Lucía Ramos',  room: 'Zona Funcional',  color: '#059669', type: 'funcional', spots: 15 },

  { day: 'Domingo',   time: '09:00',  end: '10:30',  name: 'Yoga Restaurativo',        trainer: 'Lucía Ramos',  room: 'Sala de Danza',   color: '#059669', type: 'bienestar', spots: 15 },
]

const TYPE_META = {
  funcional: { label: '⚡ Funcional', bg: 'rgba(251,191,36,0.12)',  text: '#fbbf24' },
  cardio:    { label: '🏃 Cardio',    bg: 'rgba(59,130,246,0.12)',  text: '#3b82f6' },
  fuerza:    { label: '💪 Fuerza',    bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  bienestar: { label: '🧘 Bienestar', bg: 'rgba(5,150,105,0.12)',  text: '#059669' },
}

// Horario semanal del entrenador - tabla grid
const TRAINER_WEEK = [
  { day: 'Lunes',     slots: ['07:00 CrossFit Principiantes (Z. Funcional)', '18:00 Hipertrofia Funcional (Z. Pesas)'] },
  { day: 'Martes',    slots: ['10:00 Body Pump (Sala B)', 'Tarde libre'] },
  { day: 'Miércoles', slots: ['07:00 CrossFit Intermedios (Z. Funcional)', '18:00 Hipertrofia Funcional (Z. Pesas)'] },
  { day: 'Jueves',    slots: ['07:00 Cardio Matutino (Z. Cardio)'] },
  { day: 'Viernes',   slots: ['07:00 CrossFit Avanzados (Z. Funcional)', '18:00 Hipertrofia + HIIT (Z. Pesas)'] },
  { day: 'Sábado',    slots: ['08:00 Maratón de Cardio (Multiusos)'] },
  { day: 'Domingo',   slots: ['Descanso'] },
]

export default function Schedules() {
  const { user } = useContext(AuthContext)
  const role = user?.role
  const isTrainer = role === 'TRAINER'

  const today = new Date().getDay()
  const todayName = DAYS[today === 0 ? 6 : today - 1]
  const [selectedDay, setSelectedDay] = useState(todayName)
  const [filterType, setFilterType] = useState('ALL')

  const filtered = CLASS_SCHEDULES.filter(s => s.day === selectedDay && (filterType === 'ALL' || s.type === filterType))

  const dayIndex = DAYS.indexOf(selectedDay)
  const prevDay = () => setSelectedDay(DAYS[(dayIndex - 1 + 7) % 7])
  const nextDay = () => setSelectedDay(DAYS[(dayIndex + 1) % 7])

  const cardStyle = (item) => ({
    background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}22`,
    borderRadius: '20px', padding: '1.5rem', transition: 'all 0.25s', cursor: 'default',
    borderLeft: `4px solid ${item.color}`
  })

  return (
    <div style={{ minHeight: '100vh', background: '#030712', padding: '2rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em' }}>
            Planificación semanal
          </p>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>
            {isTrainer ? 'Mi Horario de Clases' : 'Horarios y Actividades'}
          </h1>
          <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.9rem' }}>
            {isTrainer
              ? 'Visualiza tus clases programadas y los alumnos por sesión'
              : 'Consulta las clases disponibles, horarios y entrenadores asignados'}
          </p>
        </div>

        {/* ── TRAINER VIEW: su semana completa ── */}
        {isTrainer && (
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(37,99,235,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={20} color="#3b82f6" />
                </div>
                <div>
                  <p style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>Tu Plan Semanal</p>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{user?.name}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                {TRAINER_WEEK.map((d, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '10px 8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ color: '#fbbf24', fontWeight: 800, fontSize: '0.7rem', marginBottom: '6px', textTransform: 'uppercase' }}>{d.day.substring(0, 3)}</p>
                    {d.slots.map((s, j) => (
                      <p key={j} style={{ color: '#9ca3af', fontSize: '0.65rem', lineHeight: 1.5 }}>{s}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Day Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <button onClick={prevDay} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} />
          </button>
          <div style={{ flex: 1, display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {DAYS.map(day => (
              <button key={day} onClick={() => setSelectedDay(day)} style={{
                flexShrink: 0, padding: '10px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', border: 'none',
                background: selectedDay === day ? 'linear-gradient(135deg,#fbbf24,#d97706)' : 'rgba(255,255,255,0.04)',
                color: selectedDay === day ? '#030712' : '#6b7280',
                boxShadow: selectedDay === day ? '0 4px 12px rgba(251,191,36,0.25)' : 'none'
              }}>
                {day === todayName ? `${day} ●` : day}
              </button>
            ))}
          </div>
          <button onClick={nextDay} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['ALL', 'funcional', 'cardio', 'fuerza', 'bienestar'].map(t => {
            const meta = t !== 'ALL' ? TYPE_META[t] : null
            return (
              <button key={t} onClick={() => setFilterType(t)} style={{
                padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                border: filterType === t ? 'none' : '1px solid rgba(255,255,255,0.08)',
                background: filterType === t ? (meta?.bg || 'linear-gradient(135deg,#fbbf24,#d97706)') : 'rgba(255,255,255,0.03)',
                color: filterType === t ? (meta?.text || '#030712') : '#6b7280',
              }}>
                {t === 'ALL' ? '📋 Todas las clases' : meta?.label}
              </button>
            )
          })}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#374151' }}>
            <Calendar size={40} style={{ margin: '0 auto 12px', opacity: .4 }} />
            <p style={{ fontWeight: 700, fontSize: '1rem' }}>No hay actividades programadas para este día</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filtered.map((item, i) => {
              const tm = TYPE_META[item.type]
              return (
                <div key={i} style={cardStyle(item)}
                  onMouseEnter={e => { e.currentTarget.style.background = `${item.color}08`; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'none' }}
                >
                  {/* Badge + time */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, background: tm.bg, color: tm.text }}>
                      {tm.label}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '0.8rem' }}>
                      <Clock size={14} />
                      <span>{item.time} – {item.end}</span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', marginBottom: '12px' }}>{item.name}</h3>

                  {/* Meta */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={14} color="#6b7280" />
                      <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Instructor: <strong style={{ color: '#d1d5db' }}>{item.trainer}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Dumbbell size={14} color="#6b7280" />
                      <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Sala: <strong style={{ color: '#d1d5db' }}>{item.room}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={14} color="#6b7280" />
                      <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Aforo: <strong style={{ color: item.color }}>{item.spots} personas</strong></span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#4b5563', fontSize: '0.72rem' }}>📍 Reserva con anticipación</span>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div style={{ marginTop: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <span style={{ color: '#4b5563', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>Leyenda:</span>
          {Object.entries(TYPE_META).map(([k, v]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: v.text }} />
              <span style={{ color: '#6b7280', fontSize: '0.78rem' }}>{v.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
