# TEMPA Frontend Route Map

## 1. Recommended Frontend Default

For the TEMPA MVP, use `Next.js` with role-aware routing, server-side auth checks where needed, and a clear workspace-oriented navigation model.

## 2. Route Groups

### Public
- `/login`
- `/unauthorized`

### Shared Authenticated
- `/app`
- `/app/profile`

### Program Admin
- `/app/admin/programs`
- `/app/admin/programs/[programId]`
- `/app/admin/cohorts/[cohortId]`
- `/app/admin/cohorts/[cohortId]/participants`
- `/app/admin/cohorts/[cohortId]/mentors`
- `/app/admin/rubrics`

### Participant
- `/app/participant/dashboard`
- `/app/participant/projects`
- `/app/participant/projects/[projectId]`
- `/app/participant/projects/[projectId]/analysis`
- `/app/participant/projects/[projectId]/design`
- `/app/participant/projects/[projectId]/development`
- `/app/participant/projects/[projectId]/implementation`
- `/app/participant/projects/[projectId]/evaluation`

### Mentor
- `/app/mentor/dashboard`
- `/app/mentor/reviews`
- `/app/mentor/projects/[projectId]/analysis-review`
- `/app/mentor/projects/[projectId]/design-review`
- `/app/mentor/projects/[projectId]/plan-review`
- `/app/mentor/projects/[projectId]/evaluation-review`

### Executive
- `/app/executive/dashboard`
- `/app/executive/programs`
- `/app/executive/projects`

### Platform Operator
- `/app/platform/config`
- `/app/platform/audit`
- `/app/platform/monitoring`

## 3. Core Screen Inventory

### Participant Screens
- dashboard summary
- project list
- project overview
- problem statement editor
- AI analysis panel
- decision options workspace
- implementation plan editor
- progress log form
- impact metric form
- artifact upload panel
- reflection journal form
- TAI score view

### Mentor Screens
- mentor dashboard
- review queue
- problem review screen
- decision review screen
- implementation plan review screen
- reflection and assessment screen

### Program Admin Screens
- program list and create form
- program detail
- cohort management
- participant enrollment
- mentor assignment
- rubric configuration

### Executive Screens
- executive dashboard
- program summary list
- approved project portfolio

### Platform Operator Screens
- system config screen
- audit log explorer
- monitoring status view

## 4. Participant Workspace Layout

### Left Navigation
- Analysis
- Design
- Development
- Implementation
- Evaluation

### Center Workspace
- current phase content editor
- phase checklist
- form and artifact actions

### Right Rail
- AI suggestions
- knowledge references
- mentor feedback
- state and submission status

## 5. Route Protection Rules

- Participant routes show only owned projects.
- Mentor routes show only assigned projects.
- Executive routes hide draft and restricted detail.
- Admin routes allow configuration, not participant impersonation.
- Platform routes require privileged operational role.

## 6. UI State Dependencies

- Show editable forms only in `draft` or `revision_required`.
- Show submit actions only when mandatory fields are complete.
- Show review actions only for assigned mentors in `under_review`.
- Show locked read-only state after approval unless reopened.
- Show AI fallback messaging when AI is unavailable but keep manual input enabled.

## 7. Suggested App Router Structure

```text
app/
  login/page.tsx
  unauthorized/page.tsx
  app/
    layout.tsx
    profile/page.tsx
    participant/
      dashboard/page.tsx
      projects/page.tsx
      projects/[projectId]/page.tsx
      projects/[projectId]/analysis/page.tsx
      projects/[projectId]/design/page.tsx
      projects/[projectId]/development/page.tsx
      projects/[projectId]/implementation/page.tsx
      projects/[projectId]/evaluation/page.tsx
    mentor/
      dashboard/page.tsx
      reviews/page.tsx
      projects/[projectId]/analysis-review/page.tsx
      projects/[projectId]/design-review/page.tsx
      projects/[projectId]/plan-review/page.tsx
      projects/[projectId]/evaluation-review/page.tsx
    admin/
      programs/page.tsx
      programs/[programId]/page.tsx
      cohorts/[cohortId]/page.tsx
      cohorts/[cohortId]/participants/page.tsx
      cohorts/[cohortId]/mentors/page.tsx
      rubrics/page.tsx
    executive/
      dashboard/page.tsx
      programs/page.tsx
      projects/page.tsx
    platform/
      config/page.tsx
      audit/page.tsx
      monitoring/page.tsx
```

## 8. Suggested Build Order

1. login and protected app shell
2. participant dashboard and project workspace
3. mentor review queue and review screens
4. admin program and cohort management
5. reflection and TAI display
6. executive and platform views

## 9. Immediate UI Decisions To Confirm

1. Whether executive dashboard is included in MVP UI or post-MVP.
2. Whether rubric management needs UI in MVP or admin-only seed data.
3. Whether AI suggestion history appears inline or in a separate side panel.
