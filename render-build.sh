#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npm run build
npx drizzle-kit push
