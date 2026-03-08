# TEMPA MVP Backlog

## 1. Purpose

This backlog translates the restructured TEMPA documentation into an implementation-ready MVP plan covering product, engineering, QA, and operational preparation.

## 2. MVP Outcome

Deliver a working pilot that proves participants can complete a guided ADDIE-based project workflow with mentor validation, core AI support, evidence capture, and basic TAI scoring.

## 3. Epic Overview

### Epic 1 - Identity And Access
- SSO login
- session handling
- role assignment
- authorization middleware

### Epic 2 - Program And Cohort Management
- program CRUD
- cohort CRUD
- participant enrollment
- mentor assignment

### Epic 3 - Project Workspace
- project creation
- project overview page
- artifact upload
- phase status tracking

### Epic 4 - Problem Analysis AI
- submit problem statement
- run AI reframing
- root cause and stakeholder output
- mentor approval loop

### Epic 5 - Decision Design
- generate options
- select preferred option
- optional scenario comparison
- mentor validation

### Epic 6 - Implementation Planning
- draft roadmap
- KPI definition
- risk register
- mentor approval

### Epic 7 - Monitoring And Evidence
- progress log
- impact metric entry
- evidence upload linkage

### Epic 8 - Reflection And Assessment
- reflection journal
- AI reflection summary
- mentor assessment
- TAI calculation

### Epic 9 - Dashboard And Reporting
- participant dashboard
- mentor dashboard
- basic operational metrics

### Epic 10 - Audit, Security, And Operations
- audit log
- monitoring basics
- error handling
- AI request trace logging

## 4. Prioritized Stories

### P0 - Must Ship For MVP

#### Identity And Access
- As a user, I can log in via SSO and receive the correct role.
- As the system, I enforce route and API access by role and scope.

#### Program And Cohort
- As a program admin, I can create a program and cohort.
- As a program admin, I can enroll participants and assign mentors.

#### Project Workspace
- As a participant, I can create a project and view its current phase.
- As a participant, I can upload project artifacts.

#### Problem Analysis
- As a participant, I can submit a problem statement.
- As a participant, I can request AI-assisted reframing.
- As a mentor, I can approve or request revision for the problem statement.

#### Decision Design
- As a participant, I can generate solution options.
- As a participant, I can select one option for development.
- As a mentor, I can validate the selected option.

#### Implementation Planning
- As a participant, I can draft an implementation plan with milestones and KPIs.
- As a mentor, I can approve or return the plan for revision.

#### Monitoring
- As a participant, I can submit progress updates and impact metrics.

#### Reflection And TAI
- As a participant, I can submit a reflection journal.
- As a mentor, I can complete an assessment.
- As the system, I can calculate and display a basic TAI score.

#### Audit And Reliability
- As the system, I record critical workflow actions in an audit log.
- As the system, I record AI request metadata for traceability.

### P1 - Should Ship If Capacity Allows

- scenario simulation support,
- executive aggregate dashboard,
- rubric management UI,
- notification automation,
- low-confidence AI review flags,
- richer impact trend visualization.

### P2 - Defer After MVP

- multi-agency federation,
- advanced analytics warehouse,
- cross-project recommendations,
- knowledge graph,
- predictive talent intelligence,
- advanced model routing controls.

## 5. Engineering Work Breakdown

### Backend
- auth integration and role claims
- program, cohort, and enrollment APIs
- mentor assignment APIs
- project and artifact APIs
- problem statement and review APIs
- decision option APIs
- implementation plan APIs
- progress, impact, and reflection APIs
- assessment and TAI APIs
- audit and AI log persistence

### Frontend
- login flow and protected routes
- program admin screens
- participant project workspace
- mentor review queue
- problem analysis UI
- decision design UI
- implementation plan UI
- reflection form and score display
- dashboard views

### AI And Platform
- AI orchestration endpoint
- prompt version tracking
- response storage or hashing
- confidence field handling
- monitoring and alert setup

## 6. QA Backlog

### Functional Tests
- role-based access tests
- program and cohort lifecycle tests
- project creation and artifact upload tests
- workflow transition tests
- mentor approval tests
- TAI calculation output tests

### Negative Tests
- unauthorized access attempts
- invalid state transitions
- missing mandatory fields
- assessment without prerequisites
- AI timeout or failure handling

### Non-Functional Checks
- audit log presence for critical actions
- response time for core user flows
- upload validation behavior
- traceability of scoring and AI runs

## 7. Suggested Sprint Sequence

### Sprint 1
- auth and authorization
- program and cohort management
- data model baseline

### Sprint 2
- project workspace
- artifact upload
- workflow state engine baseline

### Sprint 3
- problem analysis AI flow
- mentor review queue
- audit logging

### Sprint 4
- decision design
- implementation planning
- role-based UI controls

### Sprint 5
- progress and impact tracking
- reflection journal
- assessment baseline

### Sprint 6
- TAI scoring
- participant and mentor dashboards
- hardening and pilot readiness

## 8. Definition Of Done For MVP

- core P0 stories are shipped,
- permission matrix is enforced in APIs and UI,
- workflow state machine is enforced and tested,
- audit logs exist for critical actions,
- AI failures do not block manual workflow continuation,
- pilot users can complete end-to-end flow from project creation to TAI display.

## 9. Immediate Next Build Decisions

1. Choose the first pilot tenant or institution.
2. Confirm whether scenario simulation is P0 or P1.
3. Confirm if executive dashboard is MVP or post-MVP.
4. Decide whether rubric management ships in MVP admin UI or seed data only.
