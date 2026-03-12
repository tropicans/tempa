# TEMPA Backend Skeleton

This is a starter NestJS-style backend scaffold aligned with `10-OpenAPI-MVP.yaml` and `13-Backend-Module-Skeleton.md`.

## Development Setup

1. Run `npm install`.
2. Copy `.env.example` to `.env` and update `DATABASE_URL` if needed.
3. Apply the schema to your PostgreSQL instance with `npm run prisma:push`.
4. (Optional) Load demo tenant/program/project data with `npm run prisma:seed`.
5. Start the API with `npm run start:dev`.

The Prisma schema mirrors `12-schema-postgres.sql`. Repository methods in `WorkspaceStoreService` now persist data instead of using the in-memory maps.

## Reference Commands

- `npm run prisma:generate` – regenerate Prisma Client after schema changes.
- `npm run prisma:push` – sync schema to the configured database.
- `npm run prisma:seed` – seed demo tenant, cohort, participant, mentor, and project records.
