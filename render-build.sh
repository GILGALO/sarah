#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build

# Only run database migration if DATABASE_URL is present
if [ -n "$DATABASE_URL" ]; then
  echo "Running database migrations..."
  npx drizzle-kit push
else
  echo "Skipping database migrations (DATABASE_URL not set)"
fi
