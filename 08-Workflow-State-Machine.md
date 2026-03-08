# TEMPA Workflow State Machine

## 1. Purpose

This document defines the formal state model for TEMPA MVP so workflow behavior is consistent across product design, backend services, frontend UI, QA tests, and audit controls.

## 2. Workflow Scope

The state model applies to:

- project lifecycle,
- problem statement,
- decision package,
- implementation plan,
- reflection journal,
- assessment result,
- TAI publication readiness.

## 3. Canonical States

- `draft`
- `submitted`
- `under_review`
- `revision_required`
- `approved`
- `in_implementation`
- `evaluated`
- `closed`

## 4. State Definitions

### `draft`
Artifact is being created or edited by the owning participant or authorized creator.

### `submitted`
Artifact has been formally submitted and is waiting to enter review processing.

### `under_review`
Artifact is actively being reviewed by the assigned mentor or authorized reviewer.

### `revision_required`
Reviewer rejected the current submission and returned it with comments.

### `approved`
Artifact has passed review and is accepted as the official basis for the next stage.

### `in_implementation`
Project has an approved implementation plan and is actively executing.

### `evaluated`
Final reflection and assessment inputs are complete and scoring is ready or completed.

### `closed`
Project is complete and no further edits are allowed except governed administrative reopen actions.

## 5. Project-Level State Flow

`draft -> submitted -> under_review -> approved -> in_implementation -> evaluated -> closed`

Additional loop:

`under_review -> revision_required -> draft -> submitted`

## 6. Artifact-Level State Rules

### Problem Statement
- starts in `draft`
- participant submits to `submitted`
- system or reviewer moves to `under_review`
- mentor sets `approved` or `revision_required`
- only `approved` problem statement can unlock decision design

### Decision Package
- can only start after problem statement is `approved`
- selected decision path must be marked before mentor approval
- mentor approval is required to unlock implementation planning

### Implementation Plan
- can only start after decision package is `approved`
- approved plan transitions the project to `in_implementation`

### Reflection Journal
- can be drafted during implementation but only submitted after minimum evidence requirements are met
- mentor review or assessment completion can move the project to `evaluated`

### Assessment Result
- can only be completed when reflection and required implementation evidence exist
- once assessment is finalized, TAI can be published

## 7. Allowed Transitions

| From | To | Trigger | Actor |
| --- | --- | --- | --- |
| `draft` | `submitted` | Submit artifact | Participant |
| `submitted` | `under_review` | Review intake | System or Mentor |
| `under_review` | `approved` | Approve artifact | Mentor |
| `under_review` | `revision_required` | Reject with feedback | Mentor |
| `revision_required` | `draft` | Reopen for editing | Participant |
| `approved` | `in_implementation` | Approve implementation plan | System |
| `in_implementation` | `evaluated` | Final assessment complete | System or Mentor |
| `evaluated` | `closed` | Publish final result and close | System or Program Admin |

## 8. Invalid Transition Rules

- An artifact cannot move from `draft` directly to `approved`.
- A project cannot enter `in_implementation` without an approved implementation plan.
- A project cannot move to `evaluated` without reflection and assessment prerequisites.
- A closed project cannot return to active states without audited reopen action.

## 9. Reopen And Override Rules

### Participant Rework
- `revision_required` returns to editable `draft`.

### Mentor Reopen
- mentor may request new revision before downstream approval is completed.

### Program Admin Override
- allowed only for governed exception cases,
- must record reason, actor, timestamp, prior state, and resulting state,
- must not erase original decision history.

## 10. Phase Gates By ADDIE

### Analysis Gate
- approved problem statement required.

### Design Gate
- approved decision package required.

### Development Gate
- approved implementation plan required.

### Implementation Gate
- progress and impact evidence must be recorded.

### Evaluation Gate
- reflection, assessment, and score traceability required.

## 11. AI Interaction Rules Inside Workflow

- AI can support drafting in `draft` state.
- AI can support review assistance in `under_review` state.
- AI cannot independently move state to `approved`.
- Low-confidence AI outputs should flag review but not block manual continuation.
- AI failures must leave the artifact in its prior valid business state.

## 12. Audit Requirements

Each transition must record:

- artifact or project id,
- prior state,
- new state,
- actor,
- timestamp,
- reason or note,
- related version number,
- override flag if applicable.

## 13. QA Test Focus

1. valid transitions succeed,
2. invalid transitions fail with clear messages,
3. participant edit restrictions are enforced by state,
4. approval gates block downstream actions correctly,
5. reopen and override actions are fully audited.
