import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, Users, ClipboardList, Box, FileText, Calendar,
  DollarSign, Award, Dumbbell, LogOut, ChevronLeft, ChevronRight,
  BarChart2, ShoppingBag, Apple, User, Settings
} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'

const ROLE_META = {
  ADMIN:        { label: 'Administrador',  icon: '👑', color: '#dc2626' },
  TRAINER:      { label: 'Entrenador',     icon: '🏋️', color: '#2563eb' },
  RECEPTIONIST: { label: 'Recepcionista', icon: '📋', color: '#7c3aed' },
  CLIENT:       { label: 'Cliente',        icon: '👤', color: '#059669' },
  ACCOUNTANT:   { label: 'Contador',       icon: '💰', color: '#d97706' },
  NUTRITIONIST: { label: 'Nutricionista', icon: '🥗', color: '#db2777' },
}

function NavItem({ to, icon: Icon, children, collapsed }) {
  return (
    <NavLink
      to={to}
      title={collapsed ? children : undefined}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '10px',
        padding: collapsed ? '10px' : '10px 14px',
        borderRadius: '12px', textDecoration: 'none', fontSize: '0.875rem',
        fontWeight: 600, transition: 'all 0.2s', justifyContent: collapsed ? 'center' : 'flex-start',
        background: isActive ? 'rgba(251,191,36,0.12)' : 'transparent',
        color: isActive ? '#fbbf24' : '#9ca3af',
        border: isActive ? '1px solid rgba(251,191,36,0.2)' : '1px solid transparent',
      })}
      onMouseEnter={e => { if (!e.currentTarget.style.background.includes('251')) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff' }}}
      onMouseLeave={e => { if (!e.currentTarget.classList.contains('active')) { e.currentTarget.style.background = e.currentTarget.getAttribute('data-active') === 'true' ? 'rgba(251,191,36,0.12)' : 'transparent'; e.currentTarget.style.color = e.currentTarget.getAttribute('data-active') === 'true' ? '#fbbf24' : '#9ca3af' }}}
    >
      <Icon size={18} style={{ flexShrink: 0 }} />
      {!collapsed && <span>{children}</span>}
    </NavLink>
  )
}

function SectionLabel({ children, collapsed }) {
  if (collapsed) return <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
  return (
    <p style={{ color: '#374151', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.1em', padding: '8px 14px 4px' }}>
      {children}
    </p>
  )
}

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const role = user?.role
  const meta = ROLE_META[role] || ROLE_META['CLIENT']
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarWidth = collapsed ? '68px' : '240px'

  return (
    <aside style={{
      width: sidebarWidth, minHeight: '100vh', flexShrink: 0,
      background: '#030712', borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          position: 'absolute', top: '16px', right: '-12px', zIndex: 10,
          width: '24px', height: '24px', borderRadius: '50%',
          background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#9ca3af'
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', flexShrink: 0,
          background: 'linear-gradient(135deg, #fbbf24, #d97706)',
          borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Dumbbell size={18} color="#030712" />
        </div>
        {!collapsed && (
          <div>
            <p style={{ color: '#fff', fontWeight: 900, fontSize: '0.9rem', lineHeight: 1 }}>Gym <span style={{ color: '#fbbf24' }}>System</span></p>
            <p style={{ color: '#374151', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Gestión Integral</p>
          </div>
        )}
      </div>

      {/* User badge */}
      {!collapsed && (
        <div style={{
          margin: '12px', padding: '10px 12px', borderRadius: '12px',
          background: `${meta.color}11`, border: `1px solid ${meta.color}22`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>{meta.icon}</span>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.8rem', lineHeight: 1 }}>{user?.name?.split(' ')[0] || 'Usuario'}</p>
              <p style={{ color: meta.color, fontSize: '0.65rem', fontWeight: 700, marginTop: '2px' }}>{meta.label}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>

        {/* ── TODOS LOS ROLES ── */}
        <SectionLabel collapsed={collapsed}>General</SectionLabel>
        <NavItem to="/dashboard" icon={Home} collapsed={collapsed}>Inicio</NavItem>
        <NavItem to="/schedules" icon={Calendar} collapsed={collapsed}>Horarios</NavItem>

        {/* ── ADMIN ── */}
        {role === 'ADMIN' && (<>
          <SectionLabel collapsed={collapsed}>Administración</SectionLabel>
          <NavItem to="/clientes" icon={Users} collapsed={collapsed}>Clientes</NavItem>
          <NavItem to="/trainers" icon={Dumbbell} collapsed={collapsed}>Entrenadores</NavItem>
          <NavItem to="/planes" icon={Award} collapsed={collapsed}>Membresías</NavItem>
          <NavItem to="/asistencias" icon={Calendar} collapsed={collapsed}>Asistencias</NavItem>
          <SectionLabel collapsed={collapsed}>Operaciones</SectionLabel>
          <NavItem to="/inventory" icon={Box} collapsed={collapsed}>Inventario</NavItem>
          <NavItem to="/routines" icon={ClipboardList} collapsed={collapsed}>Rutinas</NavItem>
          <NavItem to="/pagos" icon={DollarSign} collapsed={collapsed}>Pagos</NavItem>
          <NavItem to="/reports" icon={BarChart2} collapsed={collapsed}>Reportes</NavItem>
        </>)}

        {/* ── RECEPCIONISTA ── */}
        {role === 'RECEPTIONIST' && (<>
          <SectionLabel collapsed={collapsed}>Gestión Diaria</SectionLabel>
          <NavItem to="/clientes" icon={Users} collapsed={collapsed}>Clientes</NavItem>
          <NavItem to="/planes" icon={Award} collapsed={collapsed}>Membresías</NavItem>
          <NavItem to="/asistencias" icon={Calendar} collapsed={collapsed}>Asistencias</NavItem>
          <NavItem to="/pagos" icon={DollarSign} collapsed={collapsed}>Pagos</NavItem>
          <SectionLabel collapsed={collapsed}>Tienda</SectionLabel>
          <NavItem to="/inventory" icon={ShoppingBag} collapsed={collapsed}>Ventas / Caja</NavItem>
        </>)}

        {/* ── ENTRENADOR ── solo ve sus clientes, no registra ── */}
        {role === 'TRAINER' && (<>
          <SectionLabel collapsed={collapsed}>Mi Trabajo</SectionLabel>
          <NavItem to="/clientes" icon={Users} collapsed={collapsed}>Mis Alumnos</NavItem>
          <NavItem to="/routines" icon={ClipboardList} collapsed={collapsed}>Rutinas</NavItem>
        </>)}

        {/* ── CLIENTE ── */}
        {role === 'CLIENT' && (<>
          <SectionLabel collapsed={collapsed}>Mi Cuenta</SectionLabel>
          <NavItem to="/planes" icon={Award} collapsed={collapsed}>Mis Planes</NavItem>
          <NavItem to="/routines" icon={ClipboardList} collapsed={collapsed}>Mi Rutina</NavItem>
          <SectionLabel collapsed={collapsed}>Servicios</SectionLabel>
          <NavItem to="/inventory" icon={ShoppingBag} collapsed={collapsed}>Tienda</NavItem>
          <NavItem to="/trainers" icon={Dumbbell} collapsed={collapsed}>Entrenadores</NavItem>
        </>)}

        {/* ── CONTADOR ── */}
        {role === 'ACCOUNTANT' && (<>
          <SectionLabel collapsed={collapsed}>Finanzas</SectionLabel>
          <NavItem to="/pagos" icon={DollarSign} collapsed={collapsed}>Pagos</NavItem>
          <NavItem to="/reports" icon={FileText} collapsed={collapsed}>Reportes</NavItem>
          <NavItem to="/clientes" icon={Users} collapsed={collapsed}>Ver Clientes</NavItem>
        </>)}

        {/* ── NUTRICIONISTA ── */}
        {role === 'NUTRITIONIST' && (<>
          <SectionLabel collapsed={collapsed}>Nutrición</SectionLabel>
          <NavItem to="/clientes" icon={Users} collapsed={collapsed}>Mis Pacientes</NavItem>
          <NavItem to="/routines" icon={Apple} collapsed={collapsed}>Planes Alimenticios</NavItem>
          <SectionLabel collapsed={collapsed}>Catálogo</SectionLabel>
          <NavItem to="/inventory" icon={ShoppingBag} collapsed={collapsed}>Suplementos</NavItem>
        </>)}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '10px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px' : '10px 14px', borderRadius: '12px',
            background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)',
            color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
          }}
        >
          <LogOut size={16} />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  )
}
