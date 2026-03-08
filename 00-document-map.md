# TEMPA Document Map

This folder restructures the original enterprise blueprint into focused documents that separate product scope, functional behavior, architecture, data/AI design, delivery planning, and executive messaging.

## New Document Set

1. `01-PRD.md` - product vision, goals, personas, scope, and MVP definition.
2. `02-FRD.md` - functional modules, workflows, business rules, permissions, and acceptance criteria.
3. `03-Solution-Architecture.md` - logical architecture, domains, services, integrations, security, and deployment.
4. `04-Data-and-AI-Design.md` - canonical data model, TAI scoring, RAG, AI governance, and evaluation.
5. `05-Delivery-Roadmap.md` - implementation priorities, phased delivery, team, risks, and execution checkpoints.
6. `06-Executive-Brief.md` - concise narrative for leadership, sponsors, and enterprise reviewers.
7. `07-Permission-Matrix.md` - detailed role-by-action access model and approval authority.
8. `08-Workflow-State-Machine.md` - formal state machine for project and phase artifacts.
9. `09-MVP-Backlog.md` - implementation-ready backlog for product, engineering, QA, and rollout.
10. `10-OpenAPI-MVP.yaml` - initial API contract for the MVP delivery scope.
11. `11-Canonical-ERD.md` - normalized core entity model and relationships for implementation.
12. `12-schema-postgres.sql` - initial transactional schema for PostgreSQL-based MVP implementation.
13. `13-Backend-Module-Skeleton.md` - recommended NestJS module breakdown aligned to the MVP API.
14. `14-Frontend-Route-Map.md` - route map, screen inventory, and UI access model for the MVP frontend.

## Why The Restructure Was Needed

- The original document mixed PRD, FRD, solution architecture, technical design, roadmap, and pitch content in a single file.
- Several sections repeated the same ideas in different levels of detail, especially architecture, ERD, API, and roadmap.
- Product requirements were less actionable than the architecture because acceptance criteria, workflow states, and MVP boundaries were not fully normalized.
- The new structure gives each audience a clearer source of truth.

## Priority Improvements Embedded In The New Structure

1. Lock a realistic MVP before enterprise-scale expansion.
2. Define canonical workflow states and approval checkpoints.
3. Add module-level acceptance criteria and exception handling.
4. Normalize the core data model and TAI scoring governance.
5. Define AI fallback, confidence thresholds, and manual override flows.
6. Simplify early architecture and defer full microservice complexity.
7. Add an explicit permission matrix and workflow state machine to remove ambiguity during implementation.

## Recommended Usage Order

1. Read `01-PRD.md` to align product direction.
2. Read `02-FRD.md` to confirm user flows and module behavior.
3. Read `04-Data-and-AI-Design.md` before backend and AI implementation.
4. Read `03-Solution-Architecture.md` to finalize technical boundaries.
5. Use `05-Delivery-Roadmap.md` for execution planning.
6. Use `06-Executive-Brief.md` for stakeholder communication.
7. Use `07-Permission-Matrix.md` and `08-Workflow-State-Machine.md` as implementation control references.
8. Use `09-MVP-Backlog.md` to drive sprint planning and QA coverage.
9. Use `10-OpenAPI-MVP.yaml` for backend contract design and frontend integration planning.
10. Use `11-Canonical-ERD.md` as the data-model source of truth before physical schema creation.
11. Use `12-schema-postgres.sql` as the starting point for transactional persistence.
12. Use `13-Backend-Module-Skeleton.md` and `14-Frontend-Route-Map.md` when scaffolding the app layers.
