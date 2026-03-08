# TEMPA Functional Requirement Document

## 1. Functional Scope

TEMPA supports a guided project-based learning workflow across the ADDIE cycle. Functional requirements are organized around user roles, core modules, workflow states, approvals, and expected outputs.

## 2. User Roles

### Participant
- create and manage a project,
- submit problem statements,
- request AI assistance,
- upload evidence and progress updates,
- submit reflection journals,
- view personal dashboard and TAI score.

### Mentor
- review participant submissions,
- approve or request revision for analysis and plans,
- provide structured feedback,
- contribute manual assessment inputs,
- override or validate selected evaluation outputs where permitted.

### Program Admin
- create programs and cohorts,
- enroll participants,
- assign mentors,
- configure rubrics and templates,
- monitor operational dashboards and reports.

### Executive Viewer
- access organization-level dashboards and portfolio summaries,
- monitor aggregate outcomes,
- review talent evidence in accordance with access policy.

## 3. Canonical Workflow States

Every project and phase-specific artifact must use an explicit workflow state:

- `draft`
- `submitted`
- `under_review`
- `revision_required`
- `approved`
- `in_implementation`
- `evaluated`
- `closed`

### Core Rules
- Participants can edit content only in `draft` or `revision_required`.
- Submitting content moves the artifact to `submitted`.
- Mentor review moves it to `approved` or `revision_required`.
- Only approved analysis can proceed to design.
- Only approved implementation plans can proceed to active implementation.
- Final score publication requires the evaluation stage to reach `evaluated`.

## 4. Functional Modules

### Module 1 - Program And Cohort Management

#### Capabilities
- create programs,
- define cohort timelines,
- assign mentors,
- enroll participants,
- configure phase deadlines and templates.

#### Acceptance Criteria
- Admin can create a program with required metadata.
- Admin can create at least one cohort under a program.
- Admin can enroll participants and assign mentors.
- The system stores cohort configuration and phase windows.

### Module 2 - Project Workspace

#### Capabilities
- create participant project,
- manage current phase,
- upload project artifacts,
- track project status and timestamps.

#### Acceptance Criteria
- Participant can create one or more projects based on program policy.
- Project workspace shows current phase, mentor, and submission status.
- Artifact uploads are linked to the correct project and uploader.

### Module 3 - Problem Analysis

#### Capabilities
- problem statement input,
- AI problem reframing,
- root cause analysis,
- stakeholder mapping,
- competency gap analysis.

#### Required Output
- Problem and Learning Diagnostic Report.

#### Acceptance Criteria
- Participant must provide a raw problem statement before AI analysis can run.
- AI output must include reframed problem, root causes, and affected stakeholders.
- Mentor can approve or request revision on the final diagnostic report.
- System logs AI requests, response latency, and prompt version.

### Module 4 - Decision Design

#### Capabilities
- generate alternative solutions,
- compare benefits and risks,
- run what-if scenarios,
- create a decision matrix.

#### Required Output
- Decision Design Matrix.

#### Acceptance Criteria
- System generates 3 to 5 solution options unless the user limits the request.
- Each option includes benefits, risks, and trade-offs.
- Participant selects one option for further development.
- Mentor validates the selected direction before implementation planning continues.

### Module 5 - Development Planning

#### Capabilities
- implementation roadmap generation,
- KPI definition,
- risk detection,
- policy brief drafting.

#### Required Output
- Implementation Blueprint.

#### Acceptance Criteria
- Blueprint must contain milestones, KPIs, and a risk register.
- Participant can revise the plan before submission.
- Mentor approval is mandatory before the project enters implementation.

### Module 6 - Implementation Monitoring

#### Capabilities
- progress tracking,
- impact data entry,
- evidence upload,
- deviation detection,
- adaptive feedback.

#### Required Output
- Impact Monitoring Report.

#### Acceptance Criteria
- Participant can submit progress logs and impact metrics.
- Evidence artifacts must be traceable to a project and uploader.
- System flags missing required metrics or incomplete evidence.
- Dashboard reflects the latest approved or accepted implementation status.

### Module 7 - Evaluation And Reflection

#### Capabilities
- reflection journal submission,
- AI reflection analysis,
- bias detection,
- growth trajectory analysis,
- TAI computation support.

#### Required Output
- Talent Evidence Dashboard.

#### Acceptance Criteria
- Participant submits a reflection journal tied to a project.
- AI returns summary, growth indicators, and possible bias indicators.
- Final TAI score is generated only when required assessment inputs are complete.
- Score publication is traceable to rubric version and score version.

## 5. Approval Checkpoints

Human approval is mandatory for:

1. final problem definition,
2. selected decision option,
3. implementation blueprint,
4. final competency scoring,
5. talent recommendation outputs where enabled.

## 6. Exception And Fallback Rules

- If AI is unavailable, participant can continue in manual entry mode.
- If AI confidence is below threshold, the system flags the output for human review.
- If a mentor rejects a submission, the artifact returns to `revision_required` with feedback.
- If required evidence is missing, evaluation cannot move to `evaluated`.

## 7. Non-Functional Functional Dependencies

- all critical actions must create audit logs,
- AI interactions must record prompt version, model, latency, and confidence where available,
- role-based access control is required for every protected action,
- uploads must respect validation, classification, and retention policy.

## 8. Highest-Priority FRD Improvements

1. Add detailed acceptance criteria for every API-backed action.
2. Finalize the permission matrix by role and workflow state.
3. Define validation rules for evidence, metrics, and reflection submission.
4. Specify AI fallback and low-confidence handling in each affected module.
5. Align endpoints, event names, and data entities to this workflow model.
