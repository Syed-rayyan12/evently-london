# Evently Backend

Express API for Evently London using Prisma ORM and Zod validation.

## Setup

```bash
cd backend
npm install
copy .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

The server runs on `http://localhost:4000` by default.

Set the first admin login in `.env`:

```bash
ADMIN_EMAIL="admin@evently.local"
ADMIN_PASSWORD="use-a-long-random-password"
AUTH_TOKEN_SECRET="use-at-least-32-random-characters"
CORS_ORIGIN="http://localhost:3000"
```

For Railway production, set these variables in the Railway dashboard:

```bash
NODE_ENV="production"
DATABASE_URL="postgresql://..."
PORT="4000"
CORS_ORIGIN="https://your-frontend-domain.com"
ADMIN_EMAIL="your-admin-email@example.com"
ADMIN_PASSWORD="a-long-random-production-password"
AUTH_TOKEN_SECRET="a-long-random-production-secret-at-least-32-chars"
AUTH_TOKEN_TTL_SECONDS="604800"
JSON_BODY_LIMIT="15mb"
```

Production startup fails if admin credentials, token secrets, or CORS origins still use local/default values.

## Current Module

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`

The first module is authentication. Customer and vendor signups are created with `PENDING` approval status, so they cannot login until an admin approves them. Admin credentials are read from `.env`, not hardcoded in source.
