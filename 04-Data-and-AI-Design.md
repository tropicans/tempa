# TEMPA Data And AI Design

## 1. Design Objective

Define a canonical data and AI foundation for project evidence, scoring, retrieval, and governance. This document is the source of truth for core entities, TAI scoring logic, AI support patterns, and AI control requirements.

## 2. Canonical Core Entities

### Foundation Entities
- Tenant
- Institution
- UserAccount
- Role
- UserRole

### Program Entities
- Program
- Cohort
- CohortParticipant
- MentorAssignment

### Project Entities
- Project
- ProblemStatement
- DecisionOption
- ScenarioSimulation
- ImplementationPlan
- ProjectArtifact
- ProgressLog
- ImpactMetric
- ReflectionJournal

### Assessment Entities
- AssessmentRubric
- AssessmentResult
- TAIScore

### AI And Governance Entities
- AIInteractionLog
- KnowledgeDocument
- DocumentChunk
- AuditLog
- SystemConfig

## 3. Canonical Data Rules

- Every project belongs to one cohort and one participant.
- Every workflow artifact must be versionable where revision is expected.
- Every critical approval must record actor, timestamp, and version context.
- Every AI interaction must store prompt template reference, model, latency, and traceable identifiers.
- Every uploaded evidence item must be attributable to a project, user, and classification context.

## 4. TAI Scoring Design

### Components
- Problem Complexity: 0-25
- Decision Quality: 0-30
- Impact Score: 0-30
- Reflective Maturity: 0-15

### Formula

`TAI = Problem Complexity + Decision Quality + Impact Score + Reflective Maturity`

### Governance Rules
- scoring formula must be versioned,
- rubric version must be stored with every assessment result,
- mentor overrides must be traceable,
- AI-assisted sub-scores must be explainable,
- calibration review is required across cohorts or programs.

### Highest-Priority Scoring Improvements
- define exact scoring inputs per component,
- define AI vs mentor contribution rules,
- define override policy and approval levels,
- define fairness and anomaly review cadence.

## 5. AI Use Cases By Phase

### Analysis
- problem reframing,
- root cause suggestion,
- stakeholder impact extraction,
- complexity estimation.

### Design
- solution option generation,
- risk-benefit analysis,
- what-if simulation,
- decision support.

### Development
- roadmap drafting,
- KPI recommendation,
- unintended consequence detection,
- policy brief drafting.

### Implementation
- progress anomaly detection,
- impact trend support,
- adaptive recommendations.

### Evaluation
- reflection summarization,
- bias identification,
- growth indicator extraction,
- support scoring for reflective maturity.

## 6. AI Architecture Pattern

### Core Components
- prompt orchestrator,
- prompt template library,
- LLM gateway,
- RAG pipeline,
- AI guardrail service,
- AI evaluation engine.

### Recommended Pattern
- foundation model for reasoning and generation,
- embedding model for retrieval,
- reranker for context quality,
- deterministic rules engine for scoring logic,
- optional analytics models for anomaly and trend detection.

## 7. Human-In-The-Loop Policy

Human review is required when:

- problem diagnosis becomes the official project definition,
- a solution option becomes the selected implementation path,
- implementation blueprint is approved,
- final TAI or assessment is published,
- AI confidence falls below threshold,
- high-impact recommendations affect talent decisions.

## 8. RAG Design

### Knowledge Sources

#### Structured Sources
- competency framework,
- rubric definitions,
- KPI catalog,
- program metadata,
- scoring rules,
- policy metadata.

#### Unstructured Sources
- policy documents,
- project artifacts,
- reflection journals,
- mentor feedback,
- best practice repository,
- learning modules,
- institutional SOPs.

### Retrieval Pipeline
1. ingest and normalize documents,
2. classify and mask sensitive data,
3. chunk and embed content,
4. index for lexical and semantic retrieval,
5. rerank and assemble context,
6. generate grounded responses,
7. apply guardrails and response validation.

### RAG Governance Rules
- retrieved chunks must include source metadata,
- access policy must filter restricted content,
- low-confidence retrieval should trigger fallback or review,
- freshness policy must exist for dynamic sources.

## 9. AI Safety And Monitoring

### Guardrails
- prompt injection detection,
- unsafe output filtering,
- PII masking,
- source grounding,
- output redaction,
- confidence thresholding.

### Monitoring Metrics
- hallucination rate,
- relevance score,
- latency,
- token cost,
- response rating,
- model usage distribution,
- retrieval failure rate.

## 10. Data Governance

- classify data as public, internal, restricted, or sensitive,
- define retention policy for artifacts and AI logs,
- maintain metadata catalog and lineage,
- implement consent and notice for analytics on individual users,
- separate operational, analytics, audit, and vector workloads where appropriate.

## 11. Highest-Priority Data And AI Improvements

1. Finalize one canonical schema and stop maintaining parallel ERD versions.
2. Formalize TAI scoring inputs, weights, and approval logic.
3. Define confidence thresholds and fallback behavior for every AI use case.
4. Establish data classification and access rules before ingestion grows.
5. Make prompt versioning and AI trace logging mandatory from the first release.
