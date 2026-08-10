# GymSystem - API y uso rápido

Resumen rápido:
- Backend: `http://localhost:4000` (endpoints bajo `/api`)
- Frontend: `http://localhost:5173`

Autenticación
- POST `/api/auth/login` — body JSON: `{ "email": "admin@gymcity.pe", "password": "Admin123!" }`
  - Respuesta: `{ success, message, data: { user, token } }`
- POST `/api/auth/register` — registrar usuario
- GET `/api/auth/me` — requiere header `Authorization: Bearer <token>`

Clientes
- GET `/api/clients` — listar (requiere token)
- GET `/api/clients/:id` — ver cliente
- POST `/api/clients` — crear cliente
- PUT `/api/clients/:id` — actualizar
- DELETE `/api/clients/:id` — eliminar

Ejemplo curl (login + listar clientes):
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@gymcity.pe","password":"Admin123!"}' | jq -r '.data.token')

# List clients
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/clients
```

Otros endpoints importantes
- `/api/payments` — pagos y recibos
- `/api/trainers` — entrenadores
- `/api/routines` — rutinas y ejercicios
- `/api/products` — inventario

Notas sobre despliegue
- Para ejecutar migraciones en producción use `npx prisma migrate deploy` con `DATABASE_URL` apuntando a su Postgres.
- En GitHub Actions está incluido `migrate_and_seed.yml` para ejecutar migraciones/seed desde CI (workflow_dispatch). Añade `DATABASE_URL` en Settings → Secrets.

Contacto
- Si necesitas que despliegue por ti, pega las credenciales necesarias (DATABASE_URL o tokens) o conéctame al repositorio remoto.
