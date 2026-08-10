import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

if (globalThis.__GYMSYSTEM_SEED_RAN) {
  console.log('Seed already ran in this process, exiting.')
  process.exit(0)
}
globalThis.__GYMSYSTEM_SEED_RAN = true

const prisma = new PrismaClient()

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000)

async function main() {
  console.log('🌱 Iniciando seed de Gym System...')

  // ── Limpieza completa ──
  await prisma.exercise.deleteMany()
  await prisma.routine.deleteMany()
  await prisma.trainerClient.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.client.deleteMany()
  await prisma.trainer.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // ── Contraseñas simples y uniformes ──
  const adminPass    = await bcrypt.hash('admin123',      10)
  const trainerPass  = await bcrypt.hash('trainer123',   10)
  const receptPass   = await bcrypt.hash('reception123', 10)
  const clientPass   = await bcrypt.hash('cliente123',   10)
  const contPass     = await bcrypt.hash('contador123',  10)
  const nutriPass    = await bcrypt.hash('nutricion123', 10)

  // ── Usuarios del sistema ──
  const admin = await prisma.user.create({
    data: {
      name: 'Admin Gym System',
      email: 'admin@gymcity.pe',
      password: adminPass,
      role: 'ADMIN'
    }
  })

  const receptionist = await prisma.user.create({
    data: {
      name: 'Recepción Gym System',
      email: 'reception@gymcity.pe',
      password: receptPass,
      role: 'RECEPTIONIST'
    }
  })

  const trainerUser1 = await prisma.user.create({
    data: { name: 'Carlos Vega', email: 'trainer@gymcity.pe', password: trainerPass, role: 'TRAINER' }
  })
  const trainerUser2 = await prisma.user.create({
    data: { name: 'Lucía Ramos', email: 'trainer2@gymcity.pe', password: trainerPass, role: 'TRAINER' }
  })

  const accountantUser = await prisma.user.create({
    data: { name: 'Contabilidad Gym System', email: 'contador@gymcity.pe', password: contPass, role: 'ACCOUNTANT' }
  })

  const clientUser = await prisma.user.create({
    data: { name: 'Cliente Acceso', email: 'cliente@gymcity.pe', password: clientPass, role: 'CLIENT' }
  })

  const nutritionistUser = await prisma.user.create({
    data: { name: 'Nutrición Gym System', email: 'nutricion@gymcity.pe', password: nutriPass, role: 'NUTRITIONIST' }
  })

  console.log('✅ Usuarios creados:')
  console.log('   👑 Admin        → admin@gymcity.pe       / admin123')
  console.log('   🏋️  Entrenador   → trainer@gymcity.pe     / trainer123')
  console.log('   📋 Recepción    → reception@gymcity.pe   / reception123')
  console.log('   👤 Cliente      → cliente@gymcity.pe     / cliente123')
  console.log('   💰 Contador     → contador@gymcity.pe    / contador123')
  console.log('   🥗 Nutricionista→ nutricion@gymcity.pe   / nutricion123')

  // ── Trainers ──
  const trainer1 = await prisma.trainer.create({
    data: { userId: trainerUser1.id, specialty: 'Musculación y Funcional', bio: 'Entrenador certificado con enfoque en fuerza e hipertrofia.' }
  })
  const trainer2 = await prisma.trainer.create({
    data: { userId: trainerUser2.id, specialty: 'Cardio y Pérdida de Peso', bio: 'Especialista en acondicionamiento físico y hábitos saludables.' }
  })

  // ── Clientes ──
  const clients = await Promise.all([
    prisma.client.create({ data: { name: 'María López',    email: 'maria.lopez@mail.com',    phone: '999111222', dni: '74251638', status: 'ACTIVE',    trainerId: trainer1.id } }),
    prisma.client.create({ data: { name: 'Carlos Ruiz',    email: 'carlos.ruiz@mail.com',    phone: '988222333', dni: '73459812', status: 'ACTIVE',    trainerId: trainer1.id } }),
    prisma.client.create({ data: { name: 'Juana Pérez',    email: 'juana.perez@mail.com',    phone: '977333444', dni: '70881234', status: 'SUSPENDED', trainerId: trainer2.id } }),
    prisma.client.create({ data: { name: 'Pedro Gómez',    email: 'pedro.gomez@mail.com',    phone: '966444555', dni: '72118844', status: 'INACTIVE',  trainerId: trainer2.id } }),
    prisma.client.create({ data: { name: 'Ana Torres',     email: 'ana.torres@mail.com',     phone: '955555666', dni: '73669988', status: 'ACTIVE',    trainerId: trainer1.id } }),
    prisma.client.create({ data: { name: 'Luis Sánchez',   email: 'luis.sanchez@mail.com',   phone: '944666777', dni: '75221133', status: 'ACTIVE',    trainerId: trainer2.id } }),
    prisma.client.create({ data: { name: 'Rosa Vega',      email: 'rosa.vega@mail.com',      phone: '933777888', dni: '72445566', status: 'ACTIVE',    trainerId: trainer1.id } }),
    prisma.client.create({ data: { name: 'Jorge Castillo', email: 'jorge.castillo@mail.com', phone: '922888999', dni: '70553311', status: 'SUSPENDED', trainerId: trainer2.id } }),
    prisma.client.create({ data: { name: 'Marta Salazar',  email: 'marta.salazar@mail.com',  phone: '911999000', dni: '71994422', status: 'ACTIVE',    trainerId: trainer1.id } }),
    prisma.client.create({ data: { name: 'Diego Flores',   email: 'diego.flores@mail.com',   phone: '900123456', dni: '73441221', status: 'INACTIVE',  trainerId: trainer2.id } }),
  ])

  // ── Membresías ──
  const memberships = await Promise.all([
    prisma.membership.create({ data: { clientId: clients[0].id, plan: 'MONTHLY',   startDate: daysAgo(15),  endDate: daysAgo(-15), price: 80,  status: 'ACTIVE'    } }),
    prisma.membership.create({ data: { clientId: clients[1].id, plan: 'WEEKLY',    startDate: daysAgo(8),   endDate: daysAgo(-22), price: 25,  status: 'ACTIVE'    } }),
    prisma.membership.create({ data: { clientId: clients[2].id, plan: 'ANNUAL',    startDate: daysAgo(220), endDate: daysAgo(145), price: 800, status: 'CANCELLED' } }),
    prisma.membership.create({ data: { clientId: clients[4].id, plan: 'MONTHLY',   startDate: daysAgo(5),   endDate: daysAgo(-25), price: 80,  status: 'ACTIVE'    } }),
    prisma.membership.create({ data: { clientId: clients[5].id, plan: 'MONTHLY',   startDate: daysAgo(10),  endDate: daysAgo(-20), price: 80,  status: 'ACTIVE'    } }),
    prisma.membership.create({ data: { clientId: clients[6].id, plan: 'WEEKLY',    startDate: daysAgo(9),   endDate: daysAgo(2),   price: 25,  status: 'EXPIRED'   } }),
    prisma.membership.create({ data: { clientId: clients[8].id, plan: 'MONTHLY',   startDate: daysAgo(7),   endDate: daysAgo(-23), price: 80,  status: 'ACTIVE'    } }),
    prisma.membership.create({ data: { clientId: clients[9].id, plan: 'QUARTERLY', startDate: daysAgo(30),  endDate: daysAgo(-60), price: 210, status: 'ACTIVE'    } }),
  ])

  // ── Pagos ──
  await Promise.all([
    prisma.payment.create({ data: { clientId: clients[0].id, membershipId: memberships[0].id, amount: 80,  method: 'CASH',     receiptNumber: 'GS-0001', notes: 'Pago mensual',    date: daysAgo(15) } }),
    prisma.payment.create({ data: { clientId: clients[1].id, membershipId: memberships[1].id, amount: 25,  method: 'TRANSFER', receiptNumber: 'GS-0002', notes: 'Pago semanal',    date: daysAgo(8)  } }),
    prisma.payment.create({ data: { clientId: clients[4].id, membershipId: memberships[3].id, amount: 80,  method: 'CARD',     receiptNumber: 'GS-0003', notes: 'Renovación',      date: daysAgo(5)  } }),
    prisma.payment.create({ data: { clientId: clients[5].id, membershipId: memberships[4].id, amount: 80,  method: 'CASH',     receiptNumber: 'GS-0004', notes: 'Pago mensual',    date: daysAgo(12) } }),
    prisma.payment.create({ data: { clientId: clients[6].id, membershipId: memberships[5].id, amount: 25,  method: 'TRANSFER', receiptNumber: 'GS-0005', notes: 'Pago semanal',    date: daysAgo(9)  } }),
    prisma.payment.create({ data: { clientId: clients[8].id, membershipId: memberships[6].id, amount: 80,  method: 'CASH',     receiptNumber: 'GS-0006', notes: 'Pago mensual',    date: daysAgo(7)  } }),
    prisma.payment.create({ data: { clientId: clients[9].id, membershipId: memberships[7].id, amount: 210, method: 'CASH',     receiptNumber: 'GS-0007', notes: 'Plan trimestral', date: daysAgo(30) } }),
    prisma.payment.create({ data: { clientId: clients[3].id,                                   amount: 15,  method: 'CARD',     receiptNumber: 'GS-0008', notes: 'Servicio extra',  date: daysAgo(20) } }),
  ])

  // ── Asistencias ──
  const attendanceSeeds = []
  for (let i = 0; i < 20; i++) {
    const client = clients[i % clients.length]
    attendanceSeeds.push(
      prisma.attendance.create({
        data: {
          clientId: client.id,
          checkIn: daysAgo(i + 1),
          checkOut: i % 2 === 0 ? daysAgo(i) : null,
          date: daysAgo(i + 1),
          registeredById: receptionist.id,
          source: 'MANUAL'
        }
      })
    )
  }
  await Promise.all(attendanceSeeds)

  // ── Productos ──
  await prisma.product.createMany({
    data: [
      { name: 'Proteína Whey 1kg',     category: 'suplemento', stock: 18, price: 129.90, isActive: true },
      { name: 'Proteína Mass Gainer',   category: 'suplemento', stock: 10, price: 149.90, isActive: true },
      { name: 'Creatina Monohidrato',   category: 'suplemento', stock: 14, price: 89.90,  isActive: true },
      { name: 'Pre-entrenamiento',      category: 'suplemento', stock: 8,  price: 99.90,  isActive: true },
      { name: 'BCAA Aminoácidos',       category: 'suplemento', stock: 12, price: 79.90,  isActive: true },
      { name: 'Shaker Gym System',      category: 'accesorio',  stock: 25, price: 25.00,  isActive: true },
      { name: 'Guantes de Entrenamiento', category: 'accesorio', stock: 9, price: 42.00, isActive: true },
      { name: 'Bandas Elásticas x3',   category: 'accesorio',  stock: 20, price: 35.00,  isActive: true },
      { name: 'Cuerda de Saltar',       category: 'accesorio',  stock: 15, price: 18.00,  isActive: true },
      { name: 'Polera Dry Fit',         category: 'ropa',       stock: 12, price: 59.90,  isActive: true },
      { name: 'Short Deportivo',        category: 'ropa',       stock: 10, price: 49.90,  isActive: true },
      { name: 'Toalla Deportiva',       category: 'accesorio',  stock: 16, price: 20.00,  isActive: true },
      { name: 'Agua Mineral 600ml',     category: 'bebida',     stock: 60, price: 3.50,   isActive: true },
      { name: 'Gatorade 500ml',         category: 'bebida',     stock: 34, price: 6.50,   isActive: true },
      { name: 'Energizante Monster',    category: 'bebida',     stock: 20, price: 8.00,   isActive: true },
    ]
  })

  // ── Rutinas ──
  await prisma.routine.create({
    data: {
      name: 'Rutina Base Fuerza A',
      description: 'Rutina para clientes nuevos orientada a adaptación general y desarrollo de fuerza.',
      clientId: clients[0].id,
      trainerId: trainer1.id,
      exercises: {
        create: [
          { name: 'Sentadilla con barra',  sets: 4, reps: '12', restSeconds: 60,  notes: 'Técnica controlada, espalda recta' },
          { name: 'Press de banca plano',  sets: 4, reps: '10', restSeconds: 75,  notes: 'Aumentar carga progresivamente' },
          { name: 'Peso muerto',           sets: 3, reps: '8',  restSeconds: 90,  notes: 'Mantener columna neutra' },
          { name: 'Remo con barra',        sets: 3, reps: '10', restSeconds: 60,  notes: 'Codos hacia atrás' },
          { name: 'Press militar',         sets: 3, reps: '12', restSeconds: 60,  notes: 'Activar core durante el movimiento' },
        ]
      }
    }
  })

  await prisma.routine.create({
    data: {
      name: 'Cardio HIIT 30min',
      description: 'Rutina de cardio de alta intensidad para quemar grasa y mejorar resistencia.',
      clientId: clients[4].id,
      trainerId: trainer2.id,
      exercises: {
        create: [
          { name: 'Burpees',         sets: 4, reps: '15', restSeconds: 30, notes: 'Explosivo, máxima velocidad' },
          { name: 'Mountain Climbers', sets: 4, reps: '20', restSeconds: 20, notes: 'Ritmo rápido' },
          { name: 'Saltos al cajón', sets: 3, reps: '10', restSeconds: 45, notes: 'Aterrizar con rodillas semiflexionadas' },
          { name: 'Sprint en cinta', sets: 5, reps: '1 min', restSeconds: 30, notes: 'Velocidad 14 km/h' },
        ]
      }
    }
  })

  console.log('')
  console.log('✅ Seed completado — Gym System')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🏋️  Base de datos: gymsystem (PostgreSQL)')
  console.log('🌐 Frontend:  http://localhost:5173')
  console.log('🔌 Backend:   http://localhost:4000')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((error) => {
    console.error('❌ Error en seed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
