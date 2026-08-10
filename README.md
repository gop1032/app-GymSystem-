# GymSystem — Sistema Web Inteligente de Gestión de Gimnasio

Proyecto diseñado para ser un SaaS profesional de gestión de gimnasios.

Estructura principal:
- `frontend/` — React + Vite + Tailwind UI
- `backend/` — Node.js + Express + Prisma
- `backend/prisma/schema.prisma` — esquema preparado para PostgreSQL

Pasos rápidos para desarrollo:

1. Backend:
```bash
cd backend
npm install
cp .env.example .env   # editar variables
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

2. Frontend:
```bash
cd frontend
npm install
cp .env.example .env   # establecer VITE_API_URL
npm run dev
```

Notas:
- Para producción: provisionar PostgreSQL (Railway/Render), setear `DATABASE_URL` y ejecutar `npx prisma migrate deploy`.
- Se añadió Tailwind, layout principal, Navbar/Sidebar, logger, y seguridad básica (helmet, rate-limit, xss-clean).

Si quieres, puedo continuar con:
- A: Ejecutar migraciones en tu Postgres (necesito `DATABASE_URL`).
- B: Completar migración frontend resto de páginas y pulir UI/UX.
- C: Configurar CI/CD y pruebas automáticas.
# GymSystem

GYMSYSTEM — Sistema web inteligente de gestión de gimnasio

Resumen rápido
- Frontend: React + Vite
- Estilos: Tailwind (esqueleto) + CSS existentes
- Backend: Node.js + Express + Prisma (Postgres)
- Autenticación: JWT + bcrypt
- Pagos: integración Stripe (esqueleto)

Requisitos
- Node.js 18+
- npm
- Docker (para Postgres) o un servicio Postgres remoto

Variables de entorno (copiar `.env.example` a `.env`)
- `DATABASE_URL` — URL de Postgres
- `JWT_SECRET` — secreto JWT
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`
- `EMAIL_*` — credenciales SMTP

Instalación y arranque (backend)

```bash
cd backend
npm install
# (opcional) levantar Postgres con Docker:
docker run -d --name gymsystem-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=gymsystem -p 5432:5432 postgres:15
# configurar .env y luego:
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Notas
- Las migraciones requieren `DATABASE_URL` apuntando a Postgres.
- Stripe está integrado a nivel de servicio/controlador; configura claves.
- Para producción, usar Railway/Render y Vercel para frontend.
# GymSystem

GymSystem es la base del sistema de gestión para GymCity, organizado en monorepo con `frontend/` y `backend/`.

## Arranque rápido

```bash
cd frontend
npm install
npm run dev
```

```bash
cd backend
npm install
npm run dev
```

## Notas

- Copia `backend/.env.example` a `.env` antes de ejecutar el backend.
- Revisa `FIREBASE_SETUP.md` y `FIRESTORE_SCHEMA.md` para la configuración original con Firebase.
