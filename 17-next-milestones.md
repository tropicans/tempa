# TEMPA Next Milestones

## Goal

This document lists the recommended next implementation sequence so development can continue smoothly on another laptop or by another contributor.

## Milestone 1 - Real Persistence

### Objective
Replace the in-memory workspace store with a real database-backed repository layer.

### Tasks
- choose ORM: Prisma or TypeORM,
- create database connection setup,
- translate `12-schema-postgres.sql` into migrations,
- add seed data for roles and demo users,
- replace `backend/src/common/workspace-store.service.ts` with repository-backed services.

### Main Files
- `backend/src/common/workspace-store.service.ts`
- `12-schema-postgres.sql`
- `11-Canonical-ERD.md`

## Milestone 2 - Complete Participant Flow

### Objective
Make the participant workflow usable from project creation through initial mentor submission.

### Tasks
- persist project creation,
- persist problem statement drafts,
- persist AI analysis result and state transitions,
- complete design/development/implementation/evaluation forms,
- add inline validation and user feedback.

### Main Files
- `frontend/app/app/participant/projects/page.tsx`
- `frontend/app/app/participant/projects/[projectId]/analysis/page.tsx`
- `frontend/app/app/participant/projects/[projectId]/design/page.tsx`
- `frontend/app/app/participant/projects/[projectId]/development/page.tsx`

## Milestone 3 - Real Mentor Workflow

### Objective
Turn mentor review pages into functional review screens backed by real project data.

### Tasks
- load real review queue from backend,
- connect approve or revision actions to API,
- show comments and decision history,
- complete evaluation review and TAI publication flow.

### Main Files
- `frontend/app/app/mentor/reviews/page.tsx`
- `frontend/app/app/mentor/projects/[projectId]/analysis-review/page.tsx`
- `frontend/app/app/mentor/projects/[projectId]/design-review/page.tsx`
- `frontend/app/app/mentor/projects/[projectId]/evaluation-review/page.tsx`

## Milestone 4 - Real Auth And Permissions

### Objective
Replace demo cookie role switching with real authentication and tighter scoping.

### Tasks
- add JWT or SSO integration,
- map backend users to actual roles,
- enforce project ownership and mentor assignment from persisted data,
- add unauthorized and expired-session flows.

### Main Files
- `backend/src/common/authorization/authorization.service.ts`
- `backend/src/common/decorators/current-user.decorator.ts`
- `frontend/middleware.ts`
- `frontend/lib/session.ts`

## Milestone 5 - Testing And Hardening

### Objective
Raise confidence before wider development or pilot use.

### Tasks
- add backend unit tests for workflow and authorization,
- add frontend integration or component tests,
- add API error handling and loading states,
- add environment configuration examples,
- add lint and test scripts where missing.

## Suggested Execution Order

1. database and migrations,
2. participant flow persistence,
3. mentor flow persistence,
4. auth and permissions,
5. testing and hardening.

## Definition Of Good Progress

The next contributor should aim to reach these checkpoints:

- data survives restart,
- participant can create and submit a project artifact,
- mentor can review real submissions,
- authorization matches actual stored user roles,
- frontend pages show real data instead of placeholders.
