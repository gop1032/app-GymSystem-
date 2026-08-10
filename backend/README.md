# GymSystem Backend

Instructions to run backend locally:

- Copy `.env.example` to `.env` and fill values (DATABASE_URL, JWT_SECRET, etc.)
- Install dependencies: `npm install`
- Run Prisma generate: `npx prisma generate`
- Run migrations: `npx prisma migrate dev --name init`
- Seed DB: `npm run seed`
- Start in dev: `npm run dev`

Important notes for production (Postgres):

- Ensure `.env` contains a valid `DATABASE_URL` pointing to PostgreSQL (Railway/Render/Postgres).
- The `prisma/schema.prisma` is prepared for PostgreSQL (enums, Json and Decimal types enabled).
- To deploy migrations to production run `npx prisma migrate deploy` on the production environment.

If you cannot provide a remote DB now, you can test locally with SQLite by setting `provider = "sqlite"` in `prisma/schema.prisma` and using `DATABASE_URL="file:./dev.db"`.

Production migration (Railway/Render/Vercel)
-------------------------------------------

1. Provision a Postgres instance (Railway, Render, ElephantSQL, etc.) and obtain the `DATABASE_URL`.
2. Add the `DATABASE_URL` value to your environment (server `.env`) or to GitHub Actions secrets as `DATABASE_URL`.
3. Locally run the migration and seed (requires `DATABASE_URL` set):

```bash
cd backend
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
npx prisma generate
npx prisma migrate deploy
npm run seed
```

4. CI: You can trigger the GitHub Actions workflow `Deploy backend migrations` from the Actions tab after adding the secret.

Notes:
- The `prisma/schema.prisma` in this repo is configured for PostgreSQL (enums, Json, Decimal). Use SQLite only for quick local testing.
- If you want me to provision a Postgres instance in Railway, provide a Railway API key or paste `DATABASE_URL` and I will run the migration for you.
