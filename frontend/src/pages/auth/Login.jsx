import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import AuthLayout from '../../components/auth/AuthLayout'
import { AuthContext } from '../../context/AuthContext'
import { Eye, EyeOff, LogIn } from 'lucide-react'

const DEMO_CREDENTIALS = [
  { role: 'Admin', email: 'admin@gymcity.pe', password: 'admin123', color: '#dc2626' },
  { role: 'Entrenador', email: 'trainer@gymcity.pe', password: 'trainer123', color: '#2563eb' },
  { role: 'Recepción', email: 'reception@gymcity.pe', password: 'reception123', color: '#7c3aed' },
  { role: 'Cliente', email: 'cliente@gymcity.pe', password: 'cliente123', color: '#059669' },
  { role: 'Contador', email: 'contador@gymcity.pe', password: 'contador123', color: '#d97706' },
  { role: 'Nutricionista', email: 'nutricion@gymcity.pe', password: 'nutricion123', color: '#db2777' },
]

export default function Login() {
  const { login, loginWithGoogle } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm()
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [activeDemo, setActiveDemo] = useState(null)

  const onSubmit = async (values) => {
    try {
      await login({ ...values, remember })
      await Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Sesión iniciada correctamente',
        timer: 1400,
        showConfirmButton: false,
        background: '#111827',
        color: '#f3f4f6',
        iconColor: '#fbbf24'
      })
      navigate(from, { replace: true })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: error?.response?.data?.message || 'Verifica tu correo y contraseña',
        background: '#111827',
        color: '#f3f4f6'
      })
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      await Swal.fire({
        icon: 'success',
        title: '¡Sesión iniciada con Google!',
        timer: 1400,
        showConfirmButton: false,
        background: '#111827',
        color: '#f3f4f6',
        iconColor: '#fbbf24'
      })
      navigate(from, { replace: true })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error Google Auth',
        text: error?.response?.data?.message || error.message,
        background: '#111827',
        color: '#f3f4f6'
      })
    }
  }

  const fillDemo = (cred) => {
    setValue('email', cred.email)
    setValue('password', cred.password)
    setActiveDemo(cred.role)
  }

  return (
    <AuthLayout
      title="Acceso seguro al sistema"
      subtitle="Gestiona tu gimnasio desde un panel moderno con roles diferenciados para cada miembro del equipo."
      footer={<span>¿No tienes cuenta? <Link to="/register" style={{ color: '#fbbf24', fontWeight: 'bold' }}>Crear usuario</Link></span>}
    >
      {/* Quick Access Demo Buttons */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: '#6b7280', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '8px' }}>
          Acceso rápido por rol:
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {DEMO_CREDENTIALS.map((cred) => (
            <button
              key={cred.role}
              type="button"
              onClick={() => fillDemo(cred)}
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: `1px solid ${activeDemo === cred.role ? cred.color : 'rgba(255,255,255,0.12)'}`,
                background: activeDemo === cred.role ? `${cred.color}22` : 'rgba(255,255,255,0.04)',
                color: activeDemo === cred.role ? cred.color : '#9ca3af',
                transition: 'all 0.2s'
              }}
            >
              {cred.role}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '8px' }}>
            Correo electrónico
          </label>
          <input
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)', color: '#fff',
              border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
              fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
            }}
            type="email"
            placeholder="usuario@gymsystem.com"
            {...register('email', { required: 'El correo es obligatorio' })}
          />
          {errors.email && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.email.message}</p>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#d1d5db', marginBottom: '8px' }}>
            Contraseña
          </label>
          <div style={{ position: 'relative' }}>
            <input
              style={{
                width: '100%', padding: '12px 50px 12px 16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)', color: '#fff',
                border: errors.password ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.12)',
                fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box'
              }}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: '4px'
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.password.message}</p>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: '#fbbf24', width: '16px', height: '16px' }}
            />
            <span style={{ color: '#9ca3af', fontSize: '0.83rem', fontWeight: 500 }}>Recordarme</span>
          </label>
          <Link to="/forgot-password" style={{ color: '#fbbf24', fontSize: '0.83rem', fontWeight: 700, textDecoration: 'none' }}>
            ¿Olvidaste la contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%', padding: '13px',
            background: isSubmitting ? 'rgba(251,191,36,0.5)' : 'linear-gradient(135deg, #fbbf24, #d97706)',
            color: '#030712', fontWeight: 800, fontSize: '0.95rem',
            borderRadius: '12px', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: '0 4px 16px rgba(251,191,36,0.25)', transition: 'all 0.2s'
          }}
        >
          <LogIn size={18} />
          {isSubmitting ? 'Ingresando...' : 'Ingresar al Sistema'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ color: '#4b5563', fontSize: '0.8rem' }}>o continuar con</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: '100%', padding: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px', cursor: 'pointer', color: '#e5e7eb',
            fontWeight: 700, fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            transition: 'all 0.2s'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>
      </form>
    </AuthLayout>
  )
}