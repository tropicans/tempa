# TEMPA

TEMPA is an AI-augmented project-based learning platform for public sector capability development. This repository contains the current product blueprint, technical design references, and starter backend/frontend apps for the MVP.

## Repository Contents

- `backend/` - NestJS-style API skeleton.
- `frontend/` - Next.js App Router frontend skeleton.
- `00-document-map.md` - entry point for the document set.
- `10-OpenAPI-MVP.yaml` - MVP API contract draft.
- `11-Canonical-ERD.md` - canonical data model reference.
- `12-schema-postgres.sql` - starter PostgreSQL schema.
- `16-development-handoff.md` - handoff guide for continuing development on another machine.
- `17-next-milestones.md` - recommended next implementation milestones.

## Quick Start

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Runs on `http://localhost:3001/api`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`

### Docker Compose

You can run the entire stack (PostgreSQL, backend, frontend) with Docker:

```bash
docker compose up --build
```

This starts PostgreSQL on host port `7432` (container `5432`), the NestJS backend exposed at host `7001` (container `3001`), and the Next.js frontend on host `7000` (container `3000`) with `NEXT_PUBLIC_API_BASE_URL` automatically pointed at the backend service.

## Demo Access

Open `/login` and choose a demo role:

- participant
- mentor
- program admin
- executive viewer
- platform operator

## Current Status

### Implemented
- restructured PRD, FRD, architecture, AI/data, roadmap, and handoff docs,
- MVP API contract and canonical ERD,
- PostgreSQL starter schema,
- backend starter app with authorization and workflow scaffolding,
- frontend starter app with branded UI direction and role-based demo routing,
- participant starter flow and mentor review UI scaffolding.

### Not Yet Final
- database-backed persistence,
- real SSO and production auth,
- full backend repository layer,
- complete end-to-end mentor/admin/executive data integration,
- production-ready testing and deployment setup.

## Recommended Reading Order

1. `00-document-map.md`
2. `01-PRD.md`
3. `02-FRD.md`
4. `10-OpenAPI-MVP.yaml`
5. `11-Canonical-ERD.md`
6. `16-development-handoff.md`
7. `17-next-milestones.md`

## Build Validation

```bash
cd backend && npm run build
cd ../frontend && npm run build
```

## Notes

- Current local role switching is cookie-based for fast UI testing.
- Backend persistence is still in-memory and should be replaced first.
