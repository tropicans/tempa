# TEMPA Permission Matrix

## 1. Purpose

This document defines the canonical access model for TEMPA MVP so product, backend, frontend, QA, and security teams use the same authorization rules.

## 2. Roles In Scope

- Participant
- Mentor
- Program Admin
- Executive Viewer
- Platform Operator

## 3. Permission Legend

- `C` = create
- `R` = read
- `U` = update
- `S` = submit or trigger workflow transition
- `A` = approve
- `X` = no access

## 4. Core Access Principles

- Access must always be scoped by tenant, institution, cohort, and project context.
- Participants can only access their own projects unless explicit collaboration is introduced later.
- Mentors can only access assigned participant records.
- Executive viewers can access aggregate and approved reporting views, not editable project workspaces.
- Platform operators manage platform configuration and observability, not learning content decisions.

## 5. Resource Permission Matrix

| Resource | Participant | Mentor | Program Admin | Executive Viewer | Platform Operator |
| --- | --- | --- | --- | --- | --- |
| User profile (self) | R,U | R,U | R | X | R |
| Program | R | R | C,R,U | R | R |
| Cohort | R | R | C,R,U | R | R |
| Cohort enrollment | X | R | C,R,U | R | X |
| Mentor assignment | X | R | C,R,U | R | X |
| Project | C,R,U,S | R,U | R | R | R |
| Problem statement | C,R,U,S | R,U,A | R | R approved only | R |
| Decision options | C,R,U,S | R,U,A | R | R approved only | R |
| Scenario simulations | C,R,U,S | R,U | R | R approved only | R |
| Implementation plan | C,R,U,S | R,U,A | R | R approved only | R |
| Project artifact | C,R,U | R | R | X | R |
| Progress log | C,R,U,S | R,U | R | R aggregate only | R |
| Impact metric | C,R,U,S | R,U | R | R aggregate only | R |
| Reflection journal | C,R,U,S | R,U,A | R | R approved summary only | R |
| Assessment rubric | X | R | C,R,U | R | R |
| Assessment result | R | C,R,U,S | R,U | R aggregate only | R |
| TAI score | R | R,U,A | R,U | R aggregate only | R |
| Dashboard - participant | R | X | R | X | R |
| Dashboard - mentor | X | R | R | X | R |
| Dashboard - executive | X | X | R | R | R |
| Audit log | X | X | R limited | X | R |
| System config | X | X | R limited | X | C,R,U |

## 6. Workflow Action Matrix

| Action | Participant | Mentor | Program Admin | Executive Viewer | Platform Operator |
| --- | --- | --- | --- | --- | --- |
| Create project | Yes | No | No | No | No |
| Submit problem statement | Yes | No | No | No | No |
| Request AI analysis | Yes | Yes | No | No | No |
| Approve problem statement | No | Yes | Optional override | No | No |
| Return problem for revision | No | Yes | Optional override | No | No |
| Generate decision options | Yes | Yes | No | No | No |
| Select preferred option | Yes | Recommend only | No | No | No |
| Approve implementation plan | No | Yes | Optional override | No | No |
| Submit progress update | Yes | No | No | No | No |
| Upload evidence | Yes | No | No | No | No |
| Submit reflection | Yes | No | No | No | No |
| Complete assessment | No | Yes | Optional override | No | No |
| Publish TAI score | No | Yes | Optional override | No | No |
| View aggregate portfolio | No | Limited | Yes | Yes | Yes |

## 7. State-Based Authorization Rules

### Participant
- Can edit artifacts only in `draft` or `revision_required`.
- Can submit artifacts only when mandatory fields are complete.
- Cannot modify approved artifacts unless a reopen action is granted.

### Mentor
- Can review only assigned participant artifacts.
- Can approve or request revision for problem statements, selected decisions, implementation plans, reflections, and assessments.
- Cannot alter participant-authored source content after approval; mentor changes must be recorded as feedback or assessment records.

### Program Admin
- Can configure programs, cohorts, templates, and rubrics.
- Can monitor workflow exceptions and perform governed overrides where policy allows.
- Cannot impersonate participant or mentor actions without an audit trail.

### Executive Viewer
- Can only read approved, filtered, or aggregated data.
- Cannot access draft reflections, unapproved scoring details, or editable project content.

### Platform Operator
- Can manage configuration, monitoring, and platform operations.
- Cannot approve learning artifacts or modify scoring outcomes directly.

## 8. Approval Authority

### Mandatory Mentor Approval
- final problem definition,
- selected solution direction,
- implementation blueprint,
- assessment completion,
- TAI publication.

### Program Admin Override
- only for exception handling,
- must require reason code,
- must write immutable audit log,
- must not bypass final traceability.

## 9. Security Notes For Implementation

- Enforce RBAC at API and service layer.
- Add tenant and cohort scoping to every query.
- Hide restricted fields from executive and cross-role views.
- Log every approval, override, and score publication.
- Treat AI request permissions separately from content read permissions where needed.

## 10. Highest-Priority Follow-Up

1. Convert this matrix into backend authorization policies.
2. Turn each resource rule into API-level access tests.
3. Add field-level restrictions for sensitive data and reflections.
4. Align frontend visibility logic with the same matrix.
