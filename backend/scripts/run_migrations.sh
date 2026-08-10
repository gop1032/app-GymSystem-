#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DATABASE_URL-}" ]; then
  echo "ERROR: DATABASE_URL is not set. Export it and rerun."
  exit 1
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Applying migrations (deploy)..."
npx prisma migrate deploy

echo "Running seed..."
npm run seed

echo "Migrations and seed completed."
