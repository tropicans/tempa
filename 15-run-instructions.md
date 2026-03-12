# TEMPA Skeleton Run Instructions

## Backend

Path: `backend`

```bash
npm install
npm run prisma:push # apply schema to your DATABASE_URL
npm run prisma:seed # optional demo data
npm run start:dev
```

Default URL: `http://localhost:3001/api`

## Frontend

Path: `frontend`

```bash
npm install
npm run dev
```

Default URL: `http://localhost:3000`

## Recommended Next Build Steps

1. Add a database layer to the backend and connect it to `12-schema-postgres.sql`.
2. Replace placeholder responses with service and repository implementations.
3. Add auth guards and role-aware route protection.
4. Wire participant analysis, design, implementation, and evaluation screens to real API calls.

## Docker Option

Launch PostgreSQL, backend, and frontend together:

```bash
docker compose up --build
```

Expose ports:

- PostgreSQL: host `7432` → container `5432`
- Backend: host `7001` → container `3001`
- Frontend: host `7000` → container `3000`
