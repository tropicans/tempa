import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

import type { CurrentUser } from './current-user';
import type { WorkflowState } from './workflow/workflow-state.service';

type ProjectRecord = {
  projectId: string;
  cohortId: string;
  participantUserId: string;
  mentorUserId?: string;
  projectTitle: string;
  currentPhase: 'analysis' | 'design' | 'development' | 'implementation' | 'evaluation';
  workflowState: WorkflowState;
  artifacts: Array<Record<string, unknown>>;
  problemStatement?: Record<string, unknown> & { workflowState: WorkflowState };
  decisionOptions: Array<Record<string, unknown>>;
  implementationPlan?: Record<string, unknown> & { workflowState: WorkflowState };
  progressLogs: Array<Record<string, unknown>>;
  impactMetrics: Array<Record<string, unknown>>;
  reflection?: Record<string, unknown> & { workflowState: WorkflowState };
  assessment?: Record<string, unknown>;
  taiScore?: Record<string, unknown>;
};

@Injectable()
export class WorkspaceStoreService {
  private readonly programs = new Map<string, Record<string, unknown>>();
  private readonly cohorts = new Map<string, Record<string, unknown>>();
  private readonly projects = new Map<string, ProjectRecord>();

  listPrograms() {
    return Array.from(this.programs.values());
  }

  createProgram(body: Record<string, unknown>) {
    const program = {
      programId: randomUUID(),
      status: 'draft',
      ...body,
    };
    this.programs.set(program.programId, program);
    return program;
  }

  getProgram(programId: string) {
    return this.programs.get(programId) ?? { programId, programName: 'TEMPA Leadership Program', status: 'draft' };
  }

  createCohort(body: Record<string, unknown>) {
    const cohort = { cohortId: randomUUID(), status: 'draft', ...body };
    this.cohorts.set(cohort.cohortId, cohort);
    return cohort;
  }

  createEnrollment(cohortId: string, body: Record<string, unknown>) {
    return { cohortParticipantId: randomUUID(), cohortId, enrollmentStatus: 'active', ...body };
  }

  createMentorAssignment(cohortId: string, body: Record<string, unknown>) {
    return { mentorAssignmentId: randomUUID(), cohortId, ...body };
  }

  listProjects(user: CurrentUser) {
    const projects = Array.from(this.projects.values());
    if (user.role === 'participant') {
      return projects.filter((project) => project.participantUserId === user.userId);
    }
    if (user.role === 'mentor') {
      return projects.filter((project) => project.mentorUserId === user.userId);
    }
    return projects;
  }

  assertProjectAccess(projectId: string, user: CurrentUser) {
    const project = this.requireProject(projectId);
    if (user.role === 'participant' && project.participantUserId !== user.userId) {
      throw new ForbiddenException(`User ${user.userId} cannot access project ${projectId}`);
    }
    if (user.role === 'mentor' && project.mentorUserId !== user.userId) {
      throw new ForbiddenException(`Mentor ${user.userId} cannot access project ${projectId}`);
    }
    return project;
  }

  createProject(body: Record<string, unknown>, user: CurrentUser) {
    const project: ProjectRecord = {
      projectId: randomUUID(),
      cohortId: String(body.cohortId ?? 'unknown-cohort'),
      participantUserId: user.userId,
      mentorUserId: user.role === 'participant' ? 'mentor-demo' : undefined,
      projectTitle: String(body.projectTitle ?? 'Untitled Project'),
      currentPhase: 'analysis',
      workflowState: 'draft',
      artifacts: [],
      decisionOptions: [],
      progressLogs: [],
      impactMetrics: [],
    };
    this.projects.set(project.projectId, project);
    return project;
  }

  getProject(projectId: string) {
    return this.requireProject(projectId);
  }

  getDashboardSummary(user: CurrentUser) {
    const visibleProjects = this.listProjects(user);
    const latestProject = visibleProjects[visibleProjects.length - 1];
    return {
      activeProjectCount: visibleProjects.filter((project) => project.workflowState !== 'closed').length,
      currentPhase: latestProject?.currentPhase ?? 'analysis',
      latestTaiScore: latestProject?.taiScore ?? null,
      pendingReviewCount: visibleProjects.filter((project) => project.workflowState === 'submitted').length,
      assignedParticipantCount: visibleProjects.length,
      totalProjects: this.projects.size,
      totalPrograms: this.programs.size,
      averageTaiScore: this.getAverageTaiScore(),
      implementationRate: this.getImplementationRate(),
    };
  }

  seedDemoProjectForUser(user: CurrentUser) {
    if (user.role !== 'participant') {
      return;
    }
    const existing = this.listProjects(user);
    if (existing.length > 0) {
      return;
    }
    this.createProject({ cohortId: 'demo-cohort', projectTitle: 'Digital Service Improvement Pilot' }, user);
  }

  private getAverageTaiScore() {
    const scores = Array.from(this.projects.values())
      .map((project) => project.taiScore?.totalTaiScore)
      .filter((value): value is number => typeof value === 'number');
    if (scores.length === 0) {
      return 0;
    }
    return scores.reduce((sum, value) => sum + value, 0) / scores.length;
  }

  private getImplementationRate() {
    const projects = Array.from(this.projects.values());
    if (projects.length === 0) {
      return 0;
    }
    const implemented = projects.filter((project) =>
      project.workflowState === 'in_implementation' || project.workflowState === 'evaluated' || project.workflowState === 'closed',
    ).length;
    return implemented / projects.length;
  }

  createArtifact(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    const project = this.requireProject(projectId);
    const artifact = { artifactId: randomUUID(), projectId, uploadedBy: user.userId, ...body };
    project.artifacts.push(artifact);
    return artifact;
  }

  upsertProblemStatement(projectId: string, body: Record<string, unknown>) {
    const project = this.requireProject(projectId);
    const problem = { problemId: randomUUID(), projectId, workflowState: 'draft' as WorkflowState, ...body };
    project.problemStatement = problem;
    return problem;
  }

  getProblemStatement(projectId: string) {
    return this.requireProject(projectId).problemStatement;
  }

  updateProblemState(projectId: string, workflowState: WorkflowState, extra: Record<string, unknown> = {}) {
    const project = this.requireProject(projectId);
    const current = project.problemStatement ?? { problemId: randomUUID(), projectId, rawProblemText: '' };
    project.problemStatement = { ...current, ...extra, workflowState };
    return project.problemStatement;
  }

  saveDecisionOptions(projectId: string, items: Array<Record<string, unknown>>) {
    const project = this.requireProject(projectId);
    project.decisionOptions = items;
    return project.decisionOptions;
  }

  getDecisionOptions(projectId: string) {
    return this.requireProject(projectId).decisionOptions;
  }

  selectDecisionOption(projectId: string, decisionOptionId: string) {
    const project = this.requireProject(projectId);
    project.decisionOptions = project.decisionOptions.map((option) => ({
      ...option,
      selectedFlag: option.decisionOptionId === decisionOptionId,
    }));
    return project.decisionOptions.find((option) => option.decisionOptionId === decisionOptionId);
  }

  upsertImplementationPlan(projectId: string, body: Record<string, unknown>) {
    const project = this.requireProject(projectId);
    const implementationPlan = {
      implementationPlanId: randomUUID(),
      projectId,
      workflowState: 'draft' as WorkflowState,
      ...body,
    };
    project.implementationPlan = implementationPlan;
    return implementationPlan;
  }

  getImplementationPlan(projectId: string) {
    return this.requireProject(projectId).implementationPlan;
  }

  updateImplementationPlanState(projectId: string, workflowState: WorkflowState, extra: Record<string, unknown> = {}) {
    const project = this.requireProject(projectId);
    const current = project.implementationPlan ?? { implementationPlanId: randomUUID(), projectId };
    project.implementationPlan = { ...current, ...extra, workflowState };
    return project.implementationPlan;
  }

  markProjectImplementationStarted(projectId: string) {
    const project = this.requireProject(projectId);
    project.currentPhase = 'implementation';
    project.workflowState = 'in_implementation';
    return project;
  }

  createProgressLog(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    const project = this.requireProject(projectId);
    const progressLog = { progressLogId: randomUUID(), projectId, loggedBy: user.userId, ...body };
    project.progressLogs.push(progressLog);
    return progressLog;
  }

  createImpactMetric(projectId: string, body: Record<string, unknown>) {
    const project = this.requireProject(projectId);
    const impactMetric = { impactMetricId: randomUUID(), projectId, ...body };
    project.impactMetrics.push(impactMetric);
    return impactMetric;
  }

  upsertReflection(projectId: string, body: Record<string, unknown>) {
    const project = this.requireProject(projectId);
    const reflection = { reflectionId: randomUUID(), projectId, workflowState: 'draft' as WorkflowState, ...body };
    project.reflection = reflection;
    return reflection;
  }

  getReflection(projectId: string) {
    return this.requireProject(projectId).reflection;
  }

  updateReflectionState(projectId: string, workflowState: WorkflowState, extra: Record<string, unknown> = {}) {
    const project = this.requireProject(projectId);
    const current = project.reflection ?? { reflectionId: randomUUID(), projectId };
    project.reflection = { ...current, ...extra, workflowState };
    return project.reflection;
  }

  saveAssessment(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    const project = this.requireProject(projectId);
    project.assessment = { assessmentResultId: randomUUID(), projectId, assessorUserId: user.userId, ...body };
    project.currentPhase = 'evaluation';
    project.workflowState = 'evaluated';
    return project.assessment;
  }

  getOrCreateTaiScore(projectId: string) {
    const project = this.requireProject(projectId);
    if (!project.taiScore) {
      project.taiScore = {
        taiScoreId: randomUUID(),
        projectId,
        problemComplexityScore: 20,
        decisionQualityScore: 22,
        impactScore: 18,
        reflectiveMaturityScore: 12,
        totalTaiScore: 72,
        scoreVersion: 'v1',
      };
    }
    return project.taiScore;
  }

  closeProject(projectId: string) {
    const project = this.requireProject(projectId);
    project.workflowState = 'closed';
    return project;
  }

  private requireProject(projectId: string) {
    const project = this.projects.get(projectId);
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }
    return project;
  }
}
