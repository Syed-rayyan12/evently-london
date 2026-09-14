# Evently Web App

This repository is split into two application folders and deployed as two Railway services from the same source repo.

- `frontend`: Next.js website and dashboards
- `backend`: Express API, Prisma schema, and database migrations

## Frontend Service

- Railway root directory: `frontend`
- Framework: Next.js
- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm run start`
- Required env:
  - `NEXT_PUBLIC_API_URL=https://your-backend-service.up.railway.app`

Only `NEXT_PUBLIC_*` values are exposed to the browser. Do not put private secrets in frontend env variables.

## Backend Service

- Railway root directory: `backend`
- Framework: Node/Express
- Install command: `npm install`
- Build command: `npm run build`
- Start command: `npm run start`
- Database migration command: `npm run prisma:deploy`
- Required env:
  - `NODE_ENV=production`
  - `DATABASE_URL=postgresql://...`
  - `PORT=4000`
  - `CORS_ORIGIN=https://your-frontend-service.up.railway.app`
  - `ADMIN_EMAIL=your-admin-email@example.com`
  - `ADMIN_PASSWORD=a-long-random-production-password`
  - `AUTH_TOKEN_SECRET=a-long-random-production-secret-at-least-32-chars`
  - `AUTH_TOKEN_TTL_SECONDS=604800`
  - `JSON_BODY_LIMIT=15mb`

Production startup fails if local/default admin credentials, weak token secrets, wildcard CORS, or localhost CORS are used.

## Source Control Safety

`.env*`, `node_modules`, build output, and local logs are ignored. Keep all production secrets in Railway variables only.
