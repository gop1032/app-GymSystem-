param()
if (-not $env:DATABASE_URL) {
  Write-Error "DATABASE_URL environment variable is not set."
  exit 1
}

Write-Host "Generating Prisma client..."
npx prisma generate

Write-Host "Applying migrations (deploy)..."
npx prisma migrate deploy

Write-Host "Running seed..."
npm run seed

Write-Host "Migrations and seed completed."