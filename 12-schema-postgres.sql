BEGIN;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_code') THEN
    CREATE TYPE status_code AS ENUM ('active', 'inactive', 'draft', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'workflow_state') THEN
    CREATE TYPE workflow_state AS ENUM (
      'draft',
      'submitted',
      'under_review',
      'revision_required',
      'approved',
      'in_implementation',
      'evaluated',
      'closed'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_phase') THEN
    CREATE TYPE project_phase AS ENUM ('analysis', 'design', 'development', 'implementation', 'evaluation');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assessment_source_type') THEN
    CREATE TYPE assessment_source_type AS ENUM ('mentor', 'ai_assist', 'admin_override');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'review_decision_type') THEN
    CREATE TYPE review_decision_type AS ENUM ('approved', 'revision_required');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'data_classification') THEN
    CREATE TYPE data_classification AS ENUM ('public', 'internal', 'restricted', 'sensitive');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS tenant (
  tenant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_code TEXT NOT NULL UNIQUE,
  tenant_name TEXT NOT NULL,
  tenant_type TEXT NOT NULL,
  status status_code NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS institution (
  institution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  institution_name TEXT NOT NULL,
  institution_type TEXT,
  region_code TEXT,
  status status_code NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_account (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  institution_id UUID REFERENCES institution(institution_id),
  external_identity_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  job_title TEXT,
  grade_level TEXT,
  status status_code NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS role (
  role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_code TEXT NOT NULL UNIQUE,
  role_name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS user_role (
  user_role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_account(user_id),
  role_id UUID NOT NULL REFERENCES role(role_id),
  scope_type TEXT NOT NULL,
  scope_id UUID,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, role_id, scope_type, scope_id)
);

CREATE TABLE IF NOT EXISTS program (
  program_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  program_code TEXT NOT NULL,
  program_name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  status status_code NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES user_account(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, program_code)
);

CREATE TABLE IF NOT EXISTS cohort (
  cohort_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES program(program_id),
  cohort_name TEXT NOT NULL,
  phase_config_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  start_date DATE,
  end_date DATE,
  status status_code NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (program_id, cohort_name)
);

CREATE TABLE IF NOT EXISTS cohort_participant (
  cohort_participant_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES cohort(cohort_id),
  user_id UUID NOT NULL REFERENCES user_account(user_id),
  enrollment_status status_code NOT NULL DEFAULT 'active',
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cohort_id, user_id)
);

CREATE TABLE IF NOT EXISTS mentor_assignment (
  mentor_assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES cohort(cohort_id),
  mentor_user_id UUID NOT NULL REFERENCES user_account(user_id),
  participant_user_id UUID NOT NULL REFERENCES user_account(user_id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  active_flag BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (cohort_id, mentor_user_id, participant_user_id)
);

CREATE TABLE IF NOT EXISTS project (
  project_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  cohort_id UUID NOT NULL REFERENCES cohort(cohort_id),
  participant_user_id UUID NOT NULL REFERENCES user_account(user_id),
  mentor_user_id UUID REFERENCES user_account(user_id),
  project_code TEXT,
  project_title TEXT NOT NULL,
  project_status status_code NOT NULL DEFAULT 'draft',
  current_phase project_phase NOT NULL DEFAULT 'analysis',
  workflow_state workflow_state NOT NULL DEFAULT 'draft',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_artifact (
  artifact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  artifact_type TEXT NOT NULL,
  file_uri TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  classification_level data_classification NOT NULL DEFAULT 'internal',
  version_no INTEGER NOT NULL DEFAULT 1,
  uploaded_by UUID REFERENCES user_account(user_id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS progress_log (
  progress_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  phase_name project_phase NOT NULL,
  progress_percent INTEGER NOT NULL CHECK (progress_percent >= 0 AND progress_percent <= 100),
  status_note TEXT,
  risk_note TEXT,
  logged_by UUID REFERENCES user_account(user_id),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS problem_statement (
  problem_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  version_no INTEGER NOT NULL DEFAULT 1,
  raw_problem_text TEXT NOT NULL,
  reframed_problem_text TEXT,
  root_cause_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  stakeholder_map_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  competency_gap_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  workflow_state workflow_state NOT NULL DEFAULT 'draft',
  ai_confidence_score NUMERIC(5,4),
  approved_by UUID REFERENCES user_account(user_id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, version_no)
);

CREATE TABLE IF NOT EXISTS decision_option (
  decision_option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  option_rank INTEGER,
  option_title TEXT NOT NULL,
  option_description TEXT NOT NULL,
  benefit_score NUMERIC(6,2),
  risk_score NUMERIC(6,2),
  feasibility_score NUMERIC(6,2),
  selected_flag BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scenario_simulation (
  scenario_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  decision_option_id UUID NOT NULL REFERENCES decision_option(decision_option_id),
  scenario_name TEXT NOT NULL,
  input_assumption_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_summary TEXT,
  risk_tradeoff_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  simulation_score NUMERIC(6,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS implementation_plan (
  implementation_plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  version_no INTEGER NOT NULL DEFAULT 1,
  roadmap_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  milestone_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  kpi_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  risk_register_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  policy_brief_uri TEXT,
  workflow_state workflow_state NOT NULL DEFAULT 'draft',
  approval_status review_decision_type,
  approved_by UUID REFERENCES user_account(user_id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, version_no)
);

CREATE TABLE IF NOT EXISTS impact_metric (
  impact_metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  metric_code TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  baseline_value NUMERIC(18,4),
  target_value NUMERIC(18,4),
  actual_value NUMERIC(18,4) NOT NULL,
  unit_of_measure TEXT,
  measurement_date DATE NOT NULL,
  evidence_artifact_id UUID REFERENCES project_artifact(artifact_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reflection_journal (
  reflection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  version_no INTEGER NOT NULL DEFAULT 1,
  reflection_text TEXT NOT NULL,
  ai_summary TEXT,
  bias_indicator_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  growth_indicator_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  reflective_maturity_score NUMERIC(6,2),
  workflow_state workflow_state NOT NULL DEFAULT 'draft',
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, version_no)
);

CREATE TABLE IF NOT EXISTS assessment_rubric (
  rubric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  rubric_code TEXT NOT NULL,
  rubric_name TEXT NOT NULL,
  rubric_type TEXT NOT NULL,
  rubric_definition_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  version_no INTEGER NOT NULL DEFAULT 1,
  active_flag BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, rubric_code, version_no)
);

CREATE TABLE IF NOT EXISTS assessment_result (
  assessment_result_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  rubric_id UUID NOT NULL REFERENCES assessment_rubric(rubric_id),
  assessor_user_id UUID REFERENCES user_account(user_id),
  assessment_source assessment_source_type NOT NULL,
  score_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  comment_text TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tai_score (
  tai_score_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES project(project_id),
  problem_complexity_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  decision_quality_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  impact_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  reflective_maturity_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  total_tai_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  score_version TEXT NOT NULL,
  published_flag BOOLEAN NOT NULL DEFAULT FALSE,
  calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  calculated_by UUID REFERENCES user_account(user_id)
);

CREATE TABLE IF NOT EXISTS ai_interaction_log (
  ai_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  project_id UUID REFERENCES project(project_id),
  user_id UUID REFERENCES user_account(user_id),
  phase_name project_phase,
  prompt_template_code TEXT NOT NULL,
  model_name TEXT NOT NULL,
  input_hash TEXT,
  output_hash TEXT,
  confidence_score NUMERIC(5,4),
  latency_ms INTEGER,
  token_usage_in INTEGER,
  token_usage_out INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
  audit_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  actor_user_id UUID REFERENCES user_account(user_id),
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  previous_state workflow_state,
  new_state workflow_state,
  action_detail_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_config (
  config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenant(tenant_id),
  config_key TEXT NOT NULL,
  config_value_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  version_no INTEGER NOT NULL DEFAULT 1,
  active_flag BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, config_key, version_no)
);

CREATE INDEX IF NOT EXISTS idx_institution_tenant_id ON institution (tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_account_tenant_id ON user_account (tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_account_institution_id ON user_account (institution_id);
CREATE INDEX IF NOT EXISTS idx_program_tenant_id ON program (tenant_id);
CREATE INDEX IF NOT EXISTS idx_cohort_program_id ON cohort (program_id);
CREATE INDEX IF NOT EXISTS idx_cohort_participant_cohort_id ON cohort_participant (cohort_id);
CREATE INDEX IF NOT EXISTS idx_cohort_participant_user_id ON cohort_participant (user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_assignment_cohort_id ON mentor_assignment (cohort_id);
CREATE INDEX IF NOT EXISTS idx_project_cohort_id ON project (cohort_id);
CREATE INDEX IF NOT EXISTS idx_project_participant_user_id ON project (participant_user_id);
CREATE INDEX IF NOT EXISTS idx_project_mentor_user_id ON project (mentor_user_id);
CREATE INDEX IF NOT EXISTS idx_project_phase_state_status ON project (current_phase, workflow_state, project_status);
CREATE INDEX IF NOT EXISTS idx_project_artifact_project_id ON project_artifact (project_id);
CREATE INDEX IF NOT EXISTS idx_progress_log_project_id ON progress_log (project_id);
CREATE INDEX IF NOT EXISTS idx_problem_statement_project_id ON problem_statement (project_id);
CREATE INDEX IF NOT EXISTS idx_decision_option_project_id ON decision_option (project_id);
CREATE INDEX IF NOT EXISTS idx_scenario_simulation_project_id ON scenario_simulation (project_id);
CREATE INDEX IF NOT EXISTS idx_implementation_plan_project_id ON implementation_plan (project_id);
CREATE INDEX IF NOT EXISTS idx_impact_metric_project_id ON impact_metric (project_id);
CREATE INDEX IF NOT EXISTS idx_reflection_journal_project_id ON reflection_journal (project_id);
CREATE INDEX IF NOT EXISTS idx_assessment_result_project_id ON assessment_result (project_id);
CREATE INDEX IF NOT EXISTS idx_tai_score_project_id ON tai_score (project_id);
CREATE INDEX IF NOT EXISTS idx_ai_interaction_log_project_id ON ai_interaction_log (project_id);
CREATE INDEX IF NOT EXISTS idx_ai_interaction_log_created_at ON ai_interaction_log (created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_target ON audit_log (target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log (created_at);

CREATE INDEX IF NOT EXISTS idx_problem_statement_raw_problem_text_fts
  ON problem_statement USING GIN (to_tsvector('simple', COALESCE(raw_problem_text, '')));

CREATE INDEX IF NOT EXISTS idx_reflection_journal_reflection_text_fts
  ON reflection_journal USING GIN (to_tsvector('simple', COALESCE(reflection_text, '')));

COMMIT;
