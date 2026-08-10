import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useDashboard } from '../hooks/useDashboard'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import {
  ClipboardList, Award, Box, ArrowRight, Users, HeartPulse,
  TrendingUp, DollarSign, AlertTriangle, CheckCircle2,
  Dumbbell, Calendar, ShoppingBag, BarChart2, User, Calculator, Apple
} from 'lucide-react'

const ROLE_ICONS = {
  ADMIN: { icon: '👑', label: 'Administrador', color: '#dc2626' },
  TRAINER: { icon: '🏋️', label: 'Entrenador', color: '#2563eb' },
  RECEPTIONIST: { icon: '📋', label: 'Recepcionista', color: '#7c3aed' },
  CLIENT: { icon: '👤', label: 'Cliente', color: '#059669' },
  ACCOUNTANT: { icon: '💰', label: 'Contador', color: '#d97706' },
  NUTRITIONIST: { icon: '🥗', label: 'Nutricionista', color: '#db2777' },
}

function StatCard({ title, value, sub, Icon, color = '#fbbf24', loading }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', padding: '1.5rem', position: 'relative', overflow: 'hidden',
      transition: 'all 0.3s'
    }}>
      <div style={{
        position: 'absolute', top: '16px', right: '16px',
        width: '44px', height: '44px', background: `${color}22`,
        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Icon size={20} color={color} />
      </div>
      <p style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>{title}</p>
      <p style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '8px' }}>
        {loading ? <span style={{ color: '#374151' }}>•••</span> : value}
      </p>
      {sub && <p style={{ color: color, fontSize: '0.75rem', fontWeight: 600, marginTop: '4px' }}>{sub}</p>}
    </div>
  )
}

function QuickLink({ to, icon: Icon, title, desc, color = '#fbbf24' }) {
  return (
    <a href={to} style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px', padding: '1.5rem', textDecoration: 'none',
      transition: 'all 0.3s', cursor: 'pointer', minHeight: '160px'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}40`
        e.currentTarget.style.background = `${color}08`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
        e.currentTarget.style.transform = 'none'
      }}
    >
      <div>
        <div style={{
          width: '44px', height: '44px', background: `${color}22`,
          borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px'
        }}>
          <Icon size={22} color={color} />
        </div>
        <p style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>{title}</p>
        <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '4px', lineHeight: 1.5 }}>{desc}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color, fontWeight: 700, fontSize: '0.8rem', marginTop: '12px' }}>
        <span>Abrir</span>
        <ArrowRight size={14} />
      </div>
    </a>
  )
}

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const { summary, loading } = useDashboard()
  const role = user?.role
  const roleInfo = ROLE_ICONS[role] || ROLE_ICONS['CLIENT']

  const isClient = role === 'CLIENT'
  const isTrainer = role === 'TRAINER'
  const isNutritionist = role === 'NUTRITIONIST'
  const isReceptionist = role === 'RECEPTIONIST'
  const isAccountant = role === 'ACCOUNTANT'

  const chartData = summary ? [
    { name: 'Clientes', value: summary.activeClients },
    { name: 'Memb. Activas', value: summary.activeMemberships },
    { name: 'Expiradas', value: summary.expiredMemberships },
    { name: 'Asistencias', value: summary.todayAttendances }
  ] : []

  const pageStyle = {
    minHeight: '100vh',
    background: '#030712',
    padding: '2rem',
    fontFamily: "'Inter', system-ui, sans-serif"
  }

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto'
  }

  // ─── CLIENT DASHBOARD ───
  if (isClient) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          {/* Welcome Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(5,150,105,0.1) 0%, rgba(251,191,36,0.05) 100%)',
            border: '1px solid rgba(5,150,105,0.2)', borderRadius: '24px', padding: '2rem',
            marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'
          }}>
            <div style={{ fontSize: '3rem' }}>👤</div>
            <div>
              <p style={{ color: '#059669', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                ¡Bienvenido de vuelta, Socio!
              </p>
              <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>
                Hola, {user?.name || 'Atleta'} 👋
              </h1>
              <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.9rem' }}>
                Este es tu espacio personal. Consulta rutinas, planes y productos deportivos.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <QuickLink to="/routines" icon={ClipboardList} title="Mi Rutina" desc="Ejercicios prescritos por tu entrenador personal." color="#059669" />
            <QuickLink to="/planes" icon={Award} title="Mis Planes" desc="Membresías vigentes y fechas de vencimiento." color="#fbbf24" />
            <QuickLink to="/inventory" icon={ShoppingBag} title="Tienda" desc="Compra suplementos, ropa y accesorios." color="#2563eb" />
            <QuickLink to="/schedules" icon={Calendar} title="Horarios" desc="Clases grupales y horario semanal completo." color="#7c3aed" />
            <QuickLink to="/trainers" icon={Dumbbell} title="Mis Entrenadores" desc="Perfil y contacto de tu entrenador asignado." color="#db2777" />
            <QuickLink to="/dashboard" icon={HeartPulse} title="Mi Progreso" desc="Seguimiento de métricas físicas y avance." color="#d97706" />
          </div>

          {/* Motivational card */}
          <div style={{
            marginTop: '2rem', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
            borderRadius: '20px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'
          }}>
            <div style={{ fontSize: '2.5rem' }}>🔥</div>
            <div>
              <p style={{ color: '#030712', fontWeight: 900, fontSize: '1.1rem' }}>¡Sigue así!</p>
              <p style={{ color: 'rgba(3,7,18,0.7)', fontSize: '0.9rem', marginTop: '4px' }}>
                La constancia es la clave del éxito. Tu entrenador está aquí para guiarte.
              </p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <a href="/routines" style={{
                background: 'rgba(3,7,18,0.2)', color: '#030712', padding: '10px 20px',
                borderRadius: '999px', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none'
              }}>Ver Rutina Hoy →</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── TRAINER DASHBOARD ───
  if (isTrainer) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(251,191,36,0.05) 100%)',
            border: '1px solid rgba(37,99,235,0.2)', borderRadius: '24px', padding: '2rem',
            marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'
          }}>
            <div style={{ fontSize: '3rem' }}>🏋️</div>
            <div>
              <p style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Panel Técnico</p>
              <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Hola, {user?.name || 'Entrenador'} 💪</h1>
              <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.9rem' }}>Gestiona el progreso y las rutinas de tus alumnos asignados.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            <QuickLink to="/clientes" icon={Users} title="Mis Alumnos" desc="Ficha física y datos de contacto de cada alumno." color="#2563eb" />
            <QuickLink to="/routines" icon={ClipboardList} title="Rutinas de Ejercicio" desc="Crea, edita y prescribe las rutinas del día." color="#fbbf24" />
            <QuickLink to="/schedules" icon={Calendar} title="Horario de Clases" desc="Gestiona los horarios de tus clases grupales." color="#7c3aed" />
            <QuickLink to="/trainers" icon={User} title="Perfil Entrenador" desc="Actualiza tu especialidad y disponibilidad." color="#059669" />
          </div>
        </div>
      </div>
    )
  }

  // ─── NUTRITIONIST DASHBOARD ───
  if (isNutritionist) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(219,39,119,0.1) 0%, rgba(251,191,36,0.05) 100%)',
            border: '1px solid rgba(219,39,119,0.2)', borderRadius: '24px', padding: '2rem',
            marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'
          }}>
            <div style={{ fontSize: '3rem' }}>🥗</div>
            <div>
              <p style={{ color: '#db2777', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Panel de Nutrición</p>
              <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Hola, {user?.name || 'Nutricionista'} 🌿</h1>
              <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.9rem' }}>Gestiona los planes alimenticios y el seguimiento de tus pacientes.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            <QuickLink to="/clientes" icon={Users} title="Mis Pacientes" desc="Historial nutricional y medidas de cada cliente." color="#db2777" />
            <QuickLink to="/inventory" icon={Apple} title="Suplementos" desc="Catálogo de productos nutricionales disponibles." color="#059669" />
            <QuickLink to="/routines" icon={ClipboardList} title="Planes Alimenticios" desc="Diseña y asigna planes de alimentación." color="#fbbf24" />
            <QuickLink to="/schedules" icon={Calendar} title="Citas Programadas" desc="Agenda y gestiona citas de seguimiento." color="#7c3aed" />
          </div>
        </div>
      </div>
    )
  }

  // ─── ACCOUNTANT DASHBOARD ───
  if (isAccountant) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(217,119,6,0.1) 0%, rgba(251,191,36,0.05) 100%)',
            border: '1px solid rgba(217,119,6,0.2)', borderRadius: '24px', padding: '2rem',
            marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ fontSize: '3rem' }}>💰</div>
              <div>
                <p style={{ color: '#d97706', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Panel Contable</p>
                <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Hola, {user?.name || 'Contador'} 📊</h1>
                <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.9rem' }}>Resumen financiero y reportes de ingresos del gym.</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Ingresos del Mes</p>
              <p style={{ color: '#fbbf24', fontSize: '2.5rem', fontWeight: 900 }}>
                {loading ? '...' : `S/. ${summary?.monthIncome?.toFixed(2) || '0.00'}`}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <StatCard title="Clientes Activos" value={summary?.activeClients} Icon={Users} color="#059669" loading={loading} />
            <StatCard title="Membresías Activas" value={summary?.activeMemberships} Icon={CheckCircle2} color="#2563eb" loading={loading} />
            <StatCard title="Memb. Expiradas" value={summary?.expiredMemberships} Icon={AlertTriangle} color="#dc2626" loading={loading} />
            <StatCard title="Asistencias (mes)" value={summary?.todayAttendances} Icon={TrendingUp} color="#fbbf24" loading={loading} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <QuickLink to="/reports" icon={BarChart2} title="Reportes Financieros" desc="Ingresos, pagos y análisis de membresías." color="#fbbf24" />
            <QuickLink to="/clientes" icon={Users} title="Clientes y Pagos" desc="Estado de pagos y deudas de cada socio." color="#2563eb" />
          </div>
        </div>
      </div>
    )
  }

  // ─── RECEPTIONIST DASHBOARD ───
  if (isReceptionist) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(251,191,36,0.05) 100%)',
            border: '1px solid rgba(124,58,237,0.2)', borderRadius: '24px', padding: '2rem',
            marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem'
          }}>
            <div style={{ fontSize: '3rem' }}>📋</div>
            <div>
              <p style={{ color: '#7c3aed', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Panel de Recepción</p>
              <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Hola, {user?.name || 'Recepcionista'} 🌟</h1>
              <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.9rem' }}>Gestiona el ingreso de clientes y administración diaria del gimnasio.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <QuickLink to="/clientes" icon={Users} title="Clientes" desc="Registra nuevos clientes y consulta fichas." color="#7c3aed" />
            <QuickLink to="/planes" icon={Award} title="Planes y Membresías" desc="Asigna planes y renueva membresías." color="#fbbf24" />
            <QuickLink to="/inventory" icon={ShoppingBag} title="Ventas y Caja" desc="Registra ventas de productos del gym." color="#059669" />
            <QuickLink to="/schedules" icon={Calendar} title="Horarios" desc="Consulta los horarios de clases del día." color="#2563eb" />
            <QuickLink to="/trainers" icon={Dumbbell} title="Entrenadores" desc="Información y disponibilidad del staff." color="#d97706" />
            <QuickLink to="/reports" icon={BarChart2} title="Reportes" desc="Resumen de asistencias y ventas del día." color="#db2777" />
          </div>
        </div>
      </div>
    )
  }

  // ─── ADMIN DASHBOARD ───
  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(251,191,36,0.05) 100%)',
          border: '1px solid rgba(251,191,36,0.15)', borderRadius: '24px', padding: '2rem',
          marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ fontSize: '3rem' }}>👑</div>
            <div>
              <p style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Panel de Administración</p>
              <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>
                {user?.name || 'Administrador'}
              </h1>
              <p style={{ color: '#6b7280', marginTop: '4px', fontSize: '0.9rem' }}>Resumen general del gimnasio en tiempo real.</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Ingresos del Mes</p>
            <p style={{ color: '#fbbf24', fontSize: '2.5rem', fontWeight: 900 }}>
              {loading ? '...' : `S/. ${summary?.monthIncome?.toFixed(2) || '0.00'}`}
            </p>
          </div>
        </div>

        {/* KPI Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <StatCard title="Clientes Activos" value={summary?.activeClients} Icon={Users} color="#059669" loading={loading} sub="Socios registrados" />
          <StatCard title="Membresías Activas" value={summary?.activeMemberships} Icon={CheckCircle2} color="#2563eb" loading={loading} sub="En vigencia" />
          <StatCard title="Memb. Expiradas" value={summary?.expiredMemberships} Icon={AlertTriangle} color="#dc2626" loading={loading} sub="Requieren renovación" />
          <StatCard title="Asistencias (mes)" value={summary?.todayAttendances} Icon={TrendingUp} color="#fbbf24" loading={loading} sub="Check-ins registrados" />
        </div>

        {/* Chart + Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Chart */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px', padding: '1.5rem'
          }}>
            <p style={{ color: '#fff', fontWeight: 800, marginBottom: '1rem' }}>Métricas Generales</p>
            {!loading && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }}
                    labelStyle={{ color: '#fbbf24', fontWeight: 700 }}
                  />
                  <Bar dataKey="value" fill="#fbbf24" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <QuickLink to="/clientes" icon={Users} title="Clientes" desc="Gestionar socios" color="#059669" />
            <QuickLink to="/reports" icon={BarChart2} title="Reportes" desc="Finanzas e ingresos" color="#fbbf24" />
          </div>
        </div>

        {/* Module Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
          <QuickLink to="/trainers" icon={Dumbbell} title="Entrenadores" desc="Staff y horarios" color="#2563eb" />
          <QuickLink to="/inventory" icon={Box} title="Inventario" desc="Stock y ventas" color="#d97706" />
          <QuickLink to="/schedules" icon={Calendar} title="Horarios" desc="Clases y rutinas" color="#7c3aed" />
          <QuickLink to="/planes" icon={Award} title="Membresías" desc="Planes y tarifas" color="#db2777" />
        </div>
      </div>
    </div>
  )
}