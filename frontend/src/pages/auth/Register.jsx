import React, { useContext, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import AuthLayout from '../../components/auth/AuthLayout'
import { AuthContext } from '../../context/AuthContext'
import api from '../../config/api'
import { User, CreditCard, Dumbbell, ShieldCheck, CheckCircle2 } from 'lucide-react'

const PLANS = [
  { id: 'basic', name: 'Básico', price: 99, desc: 'Acceso a máquinas y pesas' },
  { id: 'pro', name: 'Pro', price: 149, desc: 'Clases grupales + Evaluación' },
  { id: 'vip', name: 'VIP', price: 199, desc: 'Entrenador personal 3 veces/sem' }
]

export default function Register() {
  const { register: createAccount, loginWithGoogle } = useContext(AuthContext)
  const navigate = useNavigate()
  
  // Wizard State
  const [step, setStep] = useState(1)
  const [trainers, setTrainers] = useState([])
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [selectedTrainer, setSelectedTrainer] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // React Hook Form for personal data
  const { register, handleSubmit, formState: { errors, isSubmitting }, getValues, trigger } = useForm({
    defaultValues: { role: 'CLIENT' }
  })

  useEffect(() => {
    // Load trainers for step 3
    api.get('/trainers').then(res => setTrainers(res.data.data || [])).catch(() => {})
  }, [])

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(['name', 'email', 'password'])
      if (!isValid) return
    }
    if (step === 3 && !selectedTrainer) {
      Swal.fire({ icon: 'warning', text: 'Por favor selecciona un entrenador' })
      return
    }
    setStep(s => s + 1)
  }

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle({ role: 'CLIENT' })
      await Swal.fire({ icon: 'success', title: 'Registro exitoso', timer: 1500, showConfirmButton: false })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error Google Auth', text: error?.response?.data?.message || error.message })
    }
  }

  const onSubmitPayment = async (e) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      // 1. Simular validación de pago
      await new Promise(r => setTimeout(r, 1500))
      
      // 2. Crear cuenta
      const personalData = getValues()
      await createAccount(personalData)
      
      // NOTA: Aquí se podrían hacer llamadas adicionales para guardar el Membership y el TrainerId 
      // usando el token recién obtenido (el usuario ya está logueado en el AuthContext)

      await Swal.fire({
        icon: 'success',
        title: '¡Pago Exitoso!',
        text: 'Tu membresía ha sido activada correctamente.',
        background: '#111827', color: '#f3f4f6', iconColor: '#fbbf24',
        confirmButtonColor: '#fbbf24'
      })
      navigate('/dashboard', { replace: true })
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error?.response?.data?.message || error.message })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AuthLayout
      title="Inscripción de Socios"
      subtitle="Regístrate, elige tu plan, selecciona tu entrenador y realiza tu pago en línea."
      footer={<span>¿Ya eres socio? <Link to="/login" style={{ color: '#fbbf24', fontWeight: 'bold' }}>Iniciar sesión</Link></span>}
    >
      {/* STEPS INDICATOR */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-700 -z-10 rounded-full"></div>
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 -z-10 rounded-full transition-all duration-300`} style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
        
        {[
          { icon: User, label: 'Datos' },
          { icon: ShieldCheck, label: 'Plan' },
          { icon: Dumbbell, label: 'Entrenador' },
          { icon: CreditCard, label: 'Pago' }
        ].map((s, i) => {
          const active = step >= i + 1
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${active ? 'bg-amber-500 border-amber-500 text-gray-900 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-gray-800 border-gray-600 text-gray-500'}`}>
                <s.icon size={18} />
              </div>
            </div>
          )
        })}
      </div>

      {/* STEP 1: PERSONAL DATA */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Nombre completo</label>
            <input className="w-full rounded-xl border border-gray-700 px-4 py-3 bg-[#1f2937] text-white focus:outline-none focus:border-amber-500" type="text" placeholder="Tu nombre" {...register('name', { required: 'El nombre es obligatorio' })} />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Correo electrónico</label>
            <input className="w-full rounded-xl border border-gray-700 px-4 py-3 bg-[#1f2937] text-white focus:outline-none focus:border-amber-500" type="email" placeholder="correo@gmail.com" {...register('email', { required: 'El correo es obligatorio' })} />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Contraseña</label>
            <input className="w-full rounded-xl border border-gray-700 px-4 py-3 bg-[#1f2937] text-white focus:outline-none focus:border-amber-500" type="password" placeholder="Mínimo 6 caracteres" {...register('password', { required: 'La contraseña es obligatoria', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>
          
          <button type="button" onClick={handleNextStep} className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(251,191,36,0.3)]">
            Siguiente Paso
          </button>

          <div className="relative flex py-2 items-center mt-2">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">O usa tu cuenta de</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>
          <button type="button" onClick={handleGoogleRegister} className="w-full flex items-center justify-center gap-3 bg-[#1f2937] hover:bg-gray-800 border border-gray-700 text-gray-200 font-bold py-3 rounded-xl transition-all duration-200">
             Continuar con Google
          </button>
        </div>
      )}

      {/* STEP 2: PLAN SELECTION */}
      {step === 2 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <p className="text-gray-300 text-sm mb-4">Selecciona la membresía que mejor se adapte a tus objetivos:</p>
          <div className="grid grid-cols-1 gap-4">
            {PLANS.map(plan => (
              <div 
                key={plan.id} 
                onClick={() => setSelectedPlan(plan.id)}
                className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex justify-between items-center ${selectedPlan === plan.id ? 'border-amber-500 bg-amber-500/10' : 'border-gray-800 bg-[#1f2937] hover:border-gray-600'}`}
              >
                <div>
                  <h4 className={`text-lg font-bold ${selectedPlan === plan.id ? 'text-amber-500' : 'text-white'}`}>{plan.name}</h4>
                  <p className="text-gray-400 text-xs mt-1">{plan.desc}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">S/.{plan.price}</span>
                  <p className="text-gray-500 text-[10px] uppercase">Mensual</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-semibold">Volver</button>
            <button type="button" onClick={handleNextStep} className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(251,191,36,0.3)]">Continuar</button>
          </div>
        </div>
      )}

      {/* STEP 3: TRAINER SELECTION */}
      {step === 3 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <p className="text-gray-300 text-sm mb-4">Elige al entrenador que guiará tu proceso:</p>
          <div className="grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {trainers.map(t => (
              <div 
                key={t.id} 
                onClick={() => setSelectedTrainer(t.id)}
                className={`relative rounded-xl cursor-pointer overflow-hidden border-2 transition-all aspect-square ${selectedTrainer === t.id ? 'border-amber-500' : 'border-gray-800'}`}
              >
                <img src={t.user?.photo || `https://ui-avatars.com/api/?name=${t.user?.name}&background=1f2937&color=fbbf24&size=150`} alt={t.user?.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
                  <h4 className="text-white font-bold text-sm leading-tight">{t.user?.name}</h4>
                  <p className="text-amber-500 text-xs font-medium">{t.specialty}</p>
                </div>
                {selectedTrainer === t.id && (
                  <div className="absolute top-2 right-2 bg-amber-500 rounded-full p-1 text-black">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>
            ))}
            {trainers.length === 0 && <p className="col-span-2 text-center text-gray-500 py-4">No hay entrenadores disponibles</p>}
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setStep(2)} className="px-6 py-3.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-semibold">Volver</button>
            <button type="button" onClick={handleNextStep} className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(251,191,36,0.3)]">Confirmar Entrenador</button>
          </div>
        </div>
      )}

      {/* STEP 4: PAYMENT */}
      {step === 4 && (
        <form onSubmit={onSubmitPayment} className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <div className="bg-[#1f2937] p-4 rounded-xl border border-gray-700 mb-6 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Total a Pagar</p>
              <h3 className="text-3xl font-black text-white">S/. {PLANS.find(p=>p.id === selectedPlan)?.price}</h3>
            </div>
            <CreditCard size={40} className="text-amber-500 opacity-20" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Número de Tarjeta (Simulado)</label>
            <input required className="w-full rounded-xl border border-gray-700 px-4 py-3 bg-[#1f2937] text-white focus:outline-none focus:border-amber-500" type="text" placeholder="4555 2333 1111 0000" maxLength="19" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Vencimiento</label>
              <input required className="w-full rounded-xl border border-gray-700 px-4 py-3 bg-[#1f2937] text-white focus:outline-none focus:border-amber-500" type="text" placeholder="MM/YY" maxLength="5" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">CVV</label>
              <input required className="w-full rounded-xl border border-gray-700 px-4 py-3 bg-[#1f2937] text-white focus:outline-none focus:border-amber-500" type="password" placeholder="***" maxLength="4" />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button type="button" disabled={isProcessing} onClick={() => setStep(3)} className="px-6 py-3.5 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 font-semibold disabled:opacity-50">Volver</button>
            <button type="submit" disabled={isProcessing} className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(251,191,36,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {isProcessing ? 'Procesando Pago...' : 'Pagar y Finalizar'}
            </button>
          </div>
        </form>
      )}
    </AuthLayout>
  )
}