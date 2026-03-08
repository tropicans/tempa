# TEMPA Backend Module Skeleton

## 1. Recommended Backend Default

For the TEMPA MVP, use `NestJS` with a modular monolith structure. Keep AI orchestration isolated as an internal module or a separate worker-facing service only if latency and scaling require it.

## 2. Top-Level Backend Structure

```text
src/
  main.ts
  app.module.ts
  common/
    auth/
    guards/
    interceptors/
    decorators/
    filters/
    dto/
    utils/
  config/
  database/
    migrations/
    seeds/
    prisma-or-typeorm/
  modules/
    auth/
    users/
    programs/
    cohorts/
    mentor-assignments/
    projects/
    artifacts/
    problem-analysis/
    decision-design/
    implementation-planning/
    monitoring/
    reflections/
    assessments/
    tai/
    dashboards/
    ai/
    audit/
    system-config/
```

## 3. Module Responsibilities

### `auth`
- current user context
- JWT verification
- role and scope extraction

### `users`
- user profile lookup
- user-role queries
- tenant and institution scoping

### `programs`
- program CRUD
- program access checks

### `cohorts`
- cohort CRUD
- enrollment endpoints

### `mentor-assignments`
- mentor-participant mapping
- review scope validation

### `projects`
- project CRUD
- project detail aggregation
- project workflow state storage

### `artifacts`
- artifact metadata create/list
- upload policy validation hooks

### `problem-analysis`
- problem statement draft
- submit/review transitions
- AI analysis integration

### `decision-design`
- decision option generation and selection
- decision review workflow
- optional scenario simulation

### `implementation-planning`
- implementation plan draft/submit/review
- phase gate to implementation

### `monitoring`
- progress logs
- impact metrics
- evidence linking

### `reflections`
- reflection draft and submit
- AI reflection analysis

### `assessments`
- mentor assessment submission
- rubric lookup

### `tai`
- TAI calculation
- score publication controls

### `dashboards`
- participant dashboard query
- mentor dashboard query
- executive aggregate query

### `ai`
- provider abstraction
- prompt registry integration
- trace logging
- confidence and fallback policy

### `audit`
- audit event writer
- audit query service for admins/operators

### `system-config`
- config lookup
- prompt and policy config resolution for MVP

## 4. Example Module Layout

```text
modules/problem-analysis/
  problem-analysis.module.ts
  problem-analysis.controller.ts
  problem-analysis.service.ts
  problem-analysis.repository.ts
  dto/
    upsert-problem-statement.dto.ts
    review-problem-statement.dto.ts
    run-problem-analysis.dto.ts
  policies/
    problem-analysis.policy.ts
```

## 5. Cross-Cutting Services

- `AuthorizationService` for permission-matrix enforcement
- `WorkflowStateService` for transition validation
- `AuditService` for mandatory transition logging
- `AiTraceService` for prompt/model usage logs
- `TenantScopeService` for request scoping

## 6. Controller To OpenAPI Mapping

- `AuthController` -> `/auth/me`
- `ProgramsController` -> `/programs`
- `CohortsController` -> `/cohorts`, `/cohorts/{cohortId}/enrollments`
- `MentorAssignmentsController` -> `/cohorts/{cohortId}/mentor-assignments`
- `ProjectsController` -> `/projects`, `/projects/{projectId}`
- `ArtifactsController` -> `/projects/{projectId}/artifacts`
- `ProblemAnalysisController` -> problem statement and AI analysis endpoints
- `DecisionDesignController` -> decision option endpoints
- `ImplementationPlanningController` -> implementation plan endpoints
- `MonitoringController` -> progress and impact endpoints
- `ReflectionsController` -> reflection and AI reflection endpoints
- `AssessmentsController` -> assessment and TAI endpoints
- `DashboardsController` -> dashboard endpoints

## 7. Recommended Internal Boundaries

- Keep read and write logic separated at service level where possible.
- Centralize workflow transition rules instead of duplicating them per controller.
- Centralize access checks against `07-Permission-Matrix.md`.
- Treat AI invocation as infrastructure behind domain-specific services, not as direct controller logic.

## 8. Suggested Build Order

1. auth, users, common guards
2. programs, cohorts, mentor-assignments
3. projects and artifacts
4. workflow and audit foundation
5. problem-analysis and decision-design
6. implementation-planning and monitoring
7. reflections, assessments, tai
8. dashboards and hardening

## 9. Immediate Scaffolding Targets

Start by generating these modules first:

- `auth`
- `programs`
- `cohorts`
- `projects`
- `problem-analysis`
- `assessments`
- `dashboards`
- `audit`
