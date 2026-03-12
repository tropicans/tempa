# TEMPA Development Handoff

## Current State

This repository already contains:

- product and architecture documents,
- MVP OpenAPI draft,
- canonical ERD and PostgreSQL starter schema,
- NestJS-style backend skeleton,
- Next.js frontend skeleton,
- role-based mock session flow,
- branded UI direction inspired by `ngodingpakeai.com`,
- participant and mentor workflows partially wired.

## Folder Guide

- `backend/` - NestJS-style API skeleton.
- `frontend/` - Next.js App Router frontend.
- `10-OpenAPI-MVP.yaml` - API contract reference.
- `11-Canonical-ERD.md` - canonical entity model.
- `12-schema-postgres.sql` - starter PostgreSQL schema.
- `15-run-instructions.md` - quick run instructions.

## How To Start On Another Laptop

### 1. Clone

```bash
git clone https://github.com/tropicans/tempa.git
cd tempa
```

### 2. Run Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend default URL:

`http://localhost:3001/api`

### 3. Run Frontend

Open another terminal:

```bash
cd tempa/frontend
npm install
npm run dev
```

Frontend default URL:

`http://localhost:3000`

## Demo Login Roles

Open `/login` and choose one of these mock roles:

- participant
- mentor
- program admin
- executive viewer
- platform operator

The role is currently stored in a cookie for fast UI testing.

## Most Important Files To Read First

### Product And System References
- `00-document-map.md`
- `01-PRD.md`
- `02-FRD.md`
- `05-Delivery-Roadmap.md`

### Technical References
- `10-OpenAPI-MVP.yaml`
- `11-Canonical-ERD.md`
- `12-schema-postgres.sql`
- `13-Backend-Module-Skeleton.md`
- `14-Frontend-Route-Map.md`

### Current Code Hotspots
- `backend/src/common/workspace-store.service.ts`
- `backend/src/common/authorization/authorization.service.ts`
- `backend/src/common/workflow/workflow-state.service.ts`
- `frontend/app/app/participant/projects/page.tsx`
- `frontend/app/app/participant/projects/[projectId]/analysis/page.tsx`
- `frontend/app/app/mentor/reviews/page.tsx`

## What Is Real vs Placeholder

### Already Working
- frontend and backend both build successfully,
- role-based route protection exists,
- participant project list and analysis flow call backend endpoints,
- mentor review pages are designed and scaffolded,
- basic backend authorization and workflow guards exist,
- backend persistence is backed by PostgreSQL via Prisma ORM,
- seed data includes roles, demo users, enrollments, and mentor assignments.

### Still Placeholder
- no real SSO yet,
- most mentor/admin/executive pages still use mocked content,
- no full CRUD repositories or ORM layer yet (workspace-store handles all persistence via Prisma).

## Recommended Next Development Order

### Priority 1 - Replace In-Memory Store
- replace `workspace-store.service.ts` with a real repository layer,
- choose Prisma or TypeORM,
- connect to `12-schema-postgres.sql`.

### Priority 2 - Complete Participant Flow
- project create,
- problem statement save,
- AI assist,
- submit for mentor review,
- continue into design and implementation screens.

### Priority 3 - Complete Mentor Flow
- review queue from real backend data,
- approve/revision actions,
- assessment submission,
- TAI publication flow.

### Priority 4 - Add Real Auth
- replace cookie role switcher,
- wire SSO or real JWT auth,
- map user roles from backend.

### Priority 5 - Add Database Migrations And Seeds
- create migration files,
- seed roles,
- seed sample program, cohort, mentor, and participant data.

## Suggested Immediate Commands

### Backend Build

```bash
cd backend
npm run build
```

### Frontend Build

```bash
cd frontend
npm run build
```

## Suggested First Task On The New Laptop

If you want the fastest path forward, start here:

1. connect backend to PostgreSQL,
2. replace in-memory data access,
3. wire participant analysis and mentor review to real persisted data.

## Notes

- This repo now includes `backend/node_modules` and `frontend/node_modules` locally on the current machine, but `.gitignore` excludes them.
- If GitHub clone works but the app fails to run, the first fix is usually `npm install` inside both `backend/` and `frontend/`.
