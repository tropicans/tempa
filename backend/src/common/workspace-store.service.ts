import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma, ProjectPhase, ProblemStatement, DecisionOption, ImplementationPlan, ImpactMetric, TaiScore } from '@prisma/client';

import type { CurrentUser } from './current-user';
import type { WorkflowState } from './workflow/workflow-state.service';
import { PrismaService } from './prisma/prisma.service';

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
  private readonly defaultTenantCode = process.env.DEFAULT_TENANT_CODE ?? 'tempa-demo';
  private readonly defaultTenantName = process.env.DEFAULT_TENANT_NAME ?? 'TEMPA Demo Tenant';
  private readonly defaultProgramCode = process.env.DEFAULT_PROGRAM_CODE ?? 'tempa-program';
  private readonly defaultProgramName = process.env.DEFAULT_PROGRAM_NAME ?? 'TEMPA Leadership Program';
  private readonly defaultCohortName = process.env.DEFAULT_COHORT_NAME ?? 'demo-cohort';
  private readonly defaultMentorAlias = process.env.DEFAULT_MENTOR_ALIAS ?? 'mentor-demo';

  constructor(private readonly prisma: PrismaService) {}

  async listPrograms() {
    const { tenant } = await this.ensureWorkspace();
    const programs = await this.prisma.program.findMany({
      where: { tenantId: tenant.tenantId },
      orderBy: { createdAt: 'asc' },
    });
    if (programs.length === 0) {
      return [await this.ensureProgram(tenant.tenantId)];
    }
    return programs;
  }

  async createProgram(body: Record<string, unknown>) {
    const tenant = await this.ensureTenant();
    const programName = this.toStringOr(body.programName, 'Untitled Program');
    const programCode = this.slugify(this.toStringOr(body.programCode, programName));
    return this.prisma.program.create({
      data: {
        tenantId: tenant.tenantId,
        programCode,
        programName,
        description: this.toStringOr(body.description, undefined),
        status: 'draft',
      },
    });
  }

  async getProgram(programId: string) {
    const program = await this.prisma.program.findUnique({ where: { programId } });
    if (program) {
      return program;
    }
    return { programId, programName: this.defaultProgramName, status: 'draft' };
  }

  async createCohort(body: Record<string, unknown>) {
    const { tenant, program } = await this.ensureWorkspace();
    const targetProgram = await this.resolveProgram(body.programId, tenant.tenantId, program.programId);
    const cohortName = this.toStringOr(body.cohortName, this.defaultCohortName);
    return this.prisma.cohort.create({
      data: {
        programId: targetProgram.programId,
        cohortName,
        phaseConfig: (body.phaseConfig as Prisma.InputJsonValue | undefined) ?? {},
        status: 'draft',
      },
    });
  }

  async createEnrollment(cohortId: string, body: Record<string, unknown>) {
    const { tenant } = await this.ensureWorkspace();
    const cohort = await this.resolveCohort(cohortId, tenant.tenantId);
    const alias = this.toStringOr(body.userId ?? body.participantId, randomUUID());
    const fullName = this.toStringOr(body.fullName ?? body.participantName, 'Demo Participant');
    const user = await this.ensureExternalUser(alias, fullName, 'participant', tenant.tenantId);
    return this.prisma.cohortParticipant.upsert({
      where: { cohortId_userId: { cohortId: cohort.cohortId, userId: user.userId } },
      update: { enrollmentStatus: 'active' },
      create: { cohortId: cohort.cohortId, userId: user.userId, enrollmentStatus: 'active' },
    });
  }

  async createMentorAssignment(cohortId: string, body: Record<string, unknown>) {
    const { tenant } = await this.ensureWorkspace();
    const cohort = await this.resolveCohort(cohortId, tenant.tenantId);
    const mentorAlias = this.toStringOr(body.mentorUserId, this.defaultMentorAlias);
    const participantAlias = this.toStringOr(body.participantUserId, randomUUID());
    const mentor = await this.ensureExternalUser(mentorAlias, 'Mentor', 'mentor', tenant.tenantId);
    const participant = await this.ensureExternalUser(participantAlias, 'Participant', 'participant', tenant.tenantId);
    return this.prisma.mentorAssignment.upsert({
      where: {
        cohortId_mentorUserId_participantUserId: {
          cohortId: cohort.cohortId,
          mentorUserId: mentor.userId,
          participantUserId: participant.userId,
        },
      },
      update: { activeFlag: true },
      create: {
        cohortId: cohort.cohortId,
        mentorUserId: mentor.userId,
        participantUserId: participant.userId,
      },
    });
  }

  async listProjects(user: CurrentUser) {
    const { tenant, userAccount } = await this.ensureWorkspace(user);
    const visibilityFilter = this.getProjectVisibilityFilter(user, userAccount?.userId);
    const projects = await this.prisma.project.findMany({
      where: { tenantId: tenant.tenantId, ...visibilityFilter },
      orderBy: { createdAt: 'asc' },
      include: {
        participant: { select: { externalIdentityId: true } },
        mentor: { select: { externalIdentityId: true } },
      },
    });
    return projects.map((project) => ({
      projectId: project.projectId,
      projectTitle: project.projectTitle,
      currentPhase: project.currentPhase,
      workflowState: project.workflowState,
      participantUserId: project.participant?.externalIdentityId ?? project.participantUserId,
      mentorUserId: project.mentor?.externalIdentityId ?? project.mentorUserId ?? undefined,
    }));
  }

  async createProject(body: Record<string, unknown>, user: CurrentUser) {
    const { tenant, program, cohort, userAccount, mentorAccount } = await this.ensureWorkspace(user);
    if (!userAccount) {
      throw new NotFoundException('User account not found');
    }
    const targetCohort = await this.resolveCohort(body.cohortId, tenant.tenantId, cohort.cohortId);
    const project = await this.prisma.project.create({
      data: {
        tenantId: tenant.tenantId,
        cohortId: targetCohort.cohortId,
        participantUserId: userAccount.userId,
        mentorUserId: mentorAccount?.userId,
        projectTitle: this.toStringOr(body.projectTitle, 'Untitled Project'),
        projectStatus: 'draft',
        currentPhase: 'analysis',
        workflowState: 'draft',
        projectCode: `${program.programCode}-${Date.now()}`,
      },
    });
    return this.hydrateProject(project.projectId);
  }

  async getProject(projectId: string) {
    return this.hydrateProject(projectId);
  }

  async getDashboardSummary(user: CurrentUser) {
    const { tenant, userAccount } = await this.ensureWorkspace(user);
    const visibilityFilter = this.getProjectVisibilityFilter(user, userAccount?.userId);
    const projects = await this.prisma.project.findMany({
      where: { tenantId: tenant.tenantId, ...visibilityFilter },
      orderBy: { createdAt: 'asc' },
      include: { taiScores: true },
    });
    const latestProject = projects[projects.length - 1];
    const activeProjectCount = projects.filter((project) => project.workflowState !== 'closed').length;
    const pendingReviewCount = projects.filter((project) => project.workflowState === 'submitted').length;
    const totalProjects = await this.prisma.project.count({ where: { tenantId: tenant.tenantId } });
    const totalPrograms = await this.prisma.program.count({ where: { tenantId: tenant.tenantId } });
    const taiValues = projects
      .map((project) => project.taiScores[project.taiScores.length - 1])
      .filter((score): score is NonNullable<typeof score> => Boolean(score))
      .map((score) => this.toNumber(score.totalTaiScore) ?? 0);
    const averageTaiScore = taiValues.length > 0 ? taiValues.reduce((sum, value) => sum + value, 0) / taiValues.length : 0;
    const implementationRate = projects.length
      ? projects.filter((project) => ['in_implementation', 'evaluated', 'closed'].includes(project.workflowState)).length / projects.length
      : 0;

    const latestTaiScoreRecord = latestProject?.taiScores[latestProject.taiScores.length - 1];
    return {
      activeProjectCount,
      currentPhase: latestProject?.currentPhase ?? 'analysis',
      latestTaiScore: latestTaiScoreRecord ? this.mapTaiScore(latestTaiScoreRecord) : null,
      pendingReviewCount,
      assignedParticipantCount: projects.length,
      totalProjects,
      totalPrograms,
      averageTaiScore,
      implementationRate,
    };
  }

  async seedDemoProjectForUser(user: CurrentUser) {
    if (user.role !== 'participant') {
      return;
    }
    const existing = await this.listProjects(user);
    if (existing.length > 0) {
      return;
    }
    await this.createProject({ cohortId: this.defaultCohortName, projectTitle: 'Digital Service Improvement Pilot' }, user);
  }

  async assertProjectAccess(projectId: string, user: CurrentUser) {
    const project = await this.prisma.project.findUnique({
      where: { projectId },
      include: {
        participant: { select: { externalIdentityId: true } },
        mentor: { select: { externalIdentityId: true } },
      },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }
    if (user.role === 'participant' && project.participant?.externalIdentityId !== user.userId) {
      throw new ForbiddenException(`User ${user.userId} cannot access project ${projectId}`);
    }
    if (user.role === 'mentor' && project.mentor?.externalIdentityId !== user.userId) {
      throw new ForbiddenException(`Mentor ${user.userId} cannot access project ${projectId}`);
    }
    return this.hydrateProject(projectId);
  }

  async createArtifact(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    await this.assertProjectAccess(projectId, user);
    return this.prisma.projectArtifact.create({
      data: {
        projectId,
        artifactType: this.toStringOr(body.artifactType, 'document'),
        fileUri: this.toStringOr(body.fileUri, 's3://placeholder'),
        fileName: this.toStringOr(body.fileName, 'artifact.txt'),
        mimeType: this.toStringOr(body.mimeType, 'text/plain'),
        classification: 'internal',
        uploadedBy: (await this.ensureWorkspace(user)).userAccount?.userId,
      },
    });
  }

  async upsertProblemStatement(projectId: string, body: Record<string, unknown>) {
    const payload = this.buildProblemStatementUpsertInput(body);
    const record = await this.prisma.problemStatement.upsert({
      where: { projectId_versionNo: { projectId, versionNo: 1 } },
      update: payload,
      create: { projectId, rawProblemText: 'Draft problem statement', ...payload },
    });
    return this.mapProblemStatement(record);
  }

  async getProblemStatement(projectId: string) {
    const record = await this.prisma.problemStatement.findFirst({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
    });
    return record ? this.mapProblemStatement(record) : undefined;
  }

  async updateProblemState(projectId: string, workflowState: WorkflowState, extra: Record<string, unknown> = {}) {
    const payload = this.buildProblemStatementUpsertInput(extra);
    const record = await this.prisma.problemStatement.upsert({
      where: { projectId_versionNo: { projectId, versionNo: 1 } },
      update: { workflowState, ...payload },
      create: { projectId, workflowState, rawProblemText: 'Draft problem statement', ...payload },
    });
    return this.mapProblemStatement(record);
  }

  async saveDecisionOptions(projectId: string, items: Array<Record<string, unknown>>) {
    await this.prisma.decisionOption.deleteMany({ where: { projectId } });
    await this.prisma.decisionOption.createMany({
      data: items.map((item, index) => ({
        projectId,
        optionRank: Number(item.optionRank ?? index + 1),
        optionTitle: this.toStringOr(item.optionTitle, `Option ${index + 1}`),
        optionDescription: this.toStringOr(item.optionDescription, 'Description pending'),
        benefitScore: this.toDecimal(item.benefitScore),
        riskScore: this.toDecimal(item.riskScore),
        feasibilityScore: this.toDecimal(item.feasibilityScore),
        selectedFlag: Boolean(item.selectedFlag),
      })),
      skipDuplicates: false,
    });
    return this.getDecisionOptions(projectId);
  }

  async getDecisionOptions(projectId: string) {
    const records = await this.prisma.decisionOption.findMany({ where: { projectId }, orderBy: { createdAt: 'asc' } });
    return records.map((record) => this.mapDecisionOption(record));
  }

  async selectDecisionOption(projectId: string, decisionOptionId: string) {
    await this.prisma.decisionOption.updateMany({
      where: { projectId },
      data: { selectedFlag: false },
    });
    const record = await this.prisma.decisionOption.update({
      where: { decisionOptionId },
      data: { selectedFlag: true },
    });
    return this.mapDecisionOption(record);
  }

  async upsertImplementationPlan(projectId: string, body: Record<string, unknown>) {
    const payload = this.buildImplementationPlanUpsertInput(body);
    const record = await this.prisma.implementationPlan.upsert({
      where: { projectId_versionNo: { projectId, versionNo: 1 } },
      update: payload,
      create: { projectId, ...payload },
    });
    return record;
  }

  async getImplementationPlan(projectId: string) {
    return this.prisma.implementationPlan.findFirst({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateImplementationPlanState(projectId: string, workflowState: WorkflowState, extra: Record<string, unknown> = {}) {
    const payload = { workflowState, ...this.buildImplementationPlanUpsertInput(extra) };
    const record = await this.prisma.implementationPlan.upsert({
      where: { projectId_versionNo: { projectId, versionNo: 1 } },
      update: payload,
      create: { projectId, ...payload },
    });
    return record;
  }

  async markProjectImplementationStarted(projectId: string) {
    return this.prisma.project.update({
      where: { projectId },
      data: { currentPhase: 'implementation', workflowState: 'in_implementation' },
    });
  }

  async createProgressLog(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    const { userAccount } = await this.ensureWorkspace(user);
    return this.prisma.progressLog.create({
      data: {
        projectId,
        phaseName: (this.toStringOr(body.phaseName, 'analysis') as ProjectPhase),
        progressPercent: Number(body.progressPercent ?? 0),
        statusNote: this.toStringOr(body.statusNote, undefined),
        riskNote: this.toStringOr(body.riskNote, undefined),
        loggedById: userAccount?.userId,
      },
    });
  }

  async createImpactMetric(projectId: string, body: Record<string, unknown>) {
    const baselineValue = this.toDecimal(body.baselineValue);
    const targetValue = this.toDecimal(body.targetValue);
    const actualValue = this.toDecimal(body.actualValue, 0) ?? 0;
    return this.prisma.impactMetric.create({
      data: {
        projectId,
        metricCode: this.toStringOr(body.metricCode, `metric-${Date.now()}`),
        metricName: this.toStringOr(body.metricName, 'Impact Metric'),
        baselineValue,
        targetValue,
        actualValue,
        unitOfMeasure: this.toStringOr(body.unitOfMeasure, undefined),
        measurementDate: new Date(),
      },
    });
  }

  async upsertReflection(projectId: string, body: Record<string, unknown>) {
    const record = await this.prisma.reflectionJournal.upsert({
      where: { projectId_versionNo: { projectId, versionNo: 1 } },
      update: {
        reflectionText: this.toStringOr(body.reflectionText, ''),
        aiSummary: this.toStringOr(body.aiSummary, undefined),
        biasIndicatorJson: body.biasIndicators ?? [],
        growthIndicatorJson: body.growthIndicators ?? [],
      },
      create: {
        projectId,
        reflectionText: this.toStringOr(body.reflectionText, ''),
        aiSummary: this.toStringOr(body.aiSummary, undefined),
      },
    });
    return record;
  }

  async getReflection(projectId: string) {
    return this.prisma.reflectionJournal.findFirst({ where: { projectId }, orderBy: { updatedAt: 'desc' } });
  }

  async updateReflectionState(projectId: string, workflowState: WorkflowState, extra: Record<string, unknown> = {}) {
    const record = await this.prisma.reflectionJournal.upsert({
      where: { projectId_versionNo: { projectId, versionNo: 1 } },
      update: { workflowState, aiSummary: this.toStringOr(extra.aiSummary, undefined) },
      create: { projectId, reflectionText: '', workflowState },
    });
    return record;
  }

  async saveAssessment(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    const { tenant, userAccount } = await this.ensureWorkspace(user);
    const rubric = await this.ensureDefaultRubric(tenant.tenantId);
    await this.prisma.project.update({
      where: { projectId },
      data: { currentPhase: 'evaluation', workflowState: 'evaluated' },
    });
    return this.prisma.assessmentResult.create({
      data: {
        projectId,
        rubricId: rubric.rubricId,
        assessorUserId: userAccount?.userId,
        assessmentSource: 'mentor',
        scoreJson: body.scoreJson ?? {},
        commentText: this.toStringOr(body.commentText, undefined),
      },
    });
  }

  async getOrCreateTaiScore(projectId: string) {
    const existing = await this.prisma.taiScore.findFirst({ where: { projectId } });
    if (existing) {
      return this.mapTaiScore(existing);
    }
    const created = await this.prisma.taiScore.create({
      data: {
        projectId,
        problemComplexityScore: 20,
        decisionQualityScore: 22,
        impactScore: 18,
        reflectiveMaturityScore: 12,
        totalTaiScore: 72,
        scoreVersion: 'v1',
      },
    });
    return this.mapTaiScore(created);
  }

  async closeProject(projectId: string) {
    return this.prisma.project.update({ where: { projectId }, data: { workflowState: 'closed' } });
  }

  private async hydrateProject(projectId: string): Promise<ProjectRecord> {
    const project = await this.prisma.project.findUnique({
      where: { projectId },
      include: {
        participant: { select: { externalIdentityId: true } },
        mentor: { select: { externalIdentityId: true } },
        artifacts: true,
        decisionOptions: true,
        progressLogs: true,
        impactMetrics: true,
        problemStatements: { orderBy: { versionNo: 'desc' }, take: 1 },
        implementationPlans: { orderBy: { versionNo: 'desc' }, take: 1 },
        reflections: { orderBy: { versionNo: 'desc' }, take: 1 },
        assessments: { orderBy: { submittedAt: 'desc' }, take: 1 },
        taiScores: { orderBy: { calculatedAt: 'desc' }, take: 1 },
      },
    });
    if (!project) {
      throw new NotFoundException(`Project ${projectId} not found`);
    }
    const latestProblem = project.problemStatements[0];
    const latestPlan = project.implementationPlans[0];
    const latestReflection = project.reflections[0];
    const latestAssessment = project.assessments[0];
    const latestTaiScore = project.taiScores[0];
    return {
      projectId: project.projectId,
      cohortId: project.cohortId,
      participantUserId: project.participant?.externalIdentityId ?? project.participantUserId,
      mentorUserId: project.mentor?.externalIdentityId ?? project.mentorUserId ?? undefined,
      projectTitle: project.projectTitle,
      currentPhase: project.currentPhase,
      workflowState: project.workflowState,
      artifacts: project.artifacts,
      problemStatement: latestProblem ? this.mapProblemStatement(latestProblem) : undefined,
      decisionOptions: project.decisionOptions.map((item) => this.mapDecisionOption(item)),
      implementationPlan: latestPlan ? this.mapImplementationPlan(latestPlan) : undefined,
      progressLogs: project.progressLogs,
      impactMetrics: project.impactMetrics.map((metric) => this.mapImpactMetric(metric)),
      reflection: latestReflection ?? undefined,
      assessment: latestAssessment ?? undefined,
      taiScore: latestTaiScore ? this.mapTaiScore(latestTaiScore) : undefined,
    };
  }

  private async ensureWorkspace(user?: CurrentUser) {
    const tenant = await this.ensureTenant();
    const program = await this.ensureProgram(tenant.tenantId);
    const cohort = await this.ensureCohort(program.programId);
    const userAccount = user ? await this.ensureUserAccount(user, tenant.tenantId) : null;
    const mentorAccount = await this.ensureMentorUser(tenant.tenantId);
    return { tenant, program, cohort, userAccount, mentorAccount };
  }

  private async ensureTenant() {
    return this.prisma.tenant.upsert({
      where: { tenantCode: this.defaultTenantCode },
      update: {},
      create: {
        tenantCode: this.defaultTenantCode,
        tenantName: this.defaultTenantName,
        tenantType: 'public_sector',
        status: 'active',
      },
    });
  }

  private async ensureProgram(tenantId: string) {
    return this.prisma.program.upsert({
      where: { tenantId_programCode: { tenantId, programCode: this.defaultProgramCode } },
      update: {},
      create: {
        tenantId,
        programCode: this.defaultProgramCode,
        programName: this.defaultProgramName,
        status: 'draft',
      },
    });
  }

  private async ensureCohort(programId: string) {
    return this.prisma.cohort.upsert({
      where: { programId_cohortName: { programId, cohortName: this.defaultCohortName } },
      update: {},
      create: {
        programId,
        cohortName: this.defaultCohortName,
        phaseConfig: {},
        status: 'draft',
      },
    });
  }

  private async ensureUserAccount(user: CurrentUser, tenantId: string) {
    return this.ensureExternalUser(user.userId, user.fullName, user.role, tenantId);
  }

  private async ensureExternalUser(alias: string, fullName: string, role: CurrentUser['role'], tenantId: string) {
    return this.prisma.userAccount.upsert({
      where: { tenantId_externalIdentityId: { tenantId, externalIdentityId: alias } },
      update: { fullName },
      create: {
        tenantId,
        externalIdentityId: alias,
        fullName,
        email: `${alias}@tempa.local`,
        status: 'active',
      },
    });
  }

  private async ensureMentorUser(tenantId: string) {
    return this.ensureExternalUser(this.defaultMentorAlias, 'Demo Mentor', 'mentor', tenantId);
  }

  private async ensureDefaultRubric(tenantId: string) {
    return this.prisma.assessmentRubric.upsert({
      where: { tenantId_rubricCode_versionNo: { tenantId, rubricCode: 'tai-v1', versionNo: 1 } },
      update: {},
      create: {
        tenantId,
        rubricCode: 'tai-v1',
        rubricName: 'TAI Default Rubric',
        rubricType: 'tai',
        rubricDefinition: {},
      },
    });
  }

  private getProjectVisibilityFilter(user: CurrentUser, accountId?: string) {
    if (!accountId) {
      return {};
    }
    if (user.role === 'participant') {
      return { participantUserId: accountId };
    }
    if (user.role === 'mentor') {
      return { mentorUserId: accountId };
    }
    return {};
  }

  private buildProblemStatementUpsertInput(extra: Record<string, unknown>) {
    const payload: Partial<Prisma.ProblemStatementUncheckedCreateInput> = {};
    const rawProblemText = this.toStringOr(extra.rawProblemText, undefined);
    if (rawProblemText !== undefined) {
      payload.rawProblemText = rawProblemText;
    }
    const reframedProblemText = this.toStringOr(extra.reframedProblemText, undefined);
    if (reframedProblemText !== undefined) {
      payload.reframedProblemText = reframedProblemText;
    }
    const rootCauses = Array.isArray(extra.rootCauses) ? extra.rootCauses : undefined;
    if (rootCauses) {
      payload.rootCauseJson = rootCauses;
    }
    const stakeholders = Array.isArray(extra.stakeholders) ? extra.stakeholders : undefined;
    if (stakeholders) {
      payload.stakeholderMapJson = stakeholders;
    }
    const competencyGaps = Array.isArray(extra.competencyGaps) ? extra.competencyGaps : undefined;
    if (competencyGaps) {
      payload.competencyGapJson = competencyGaps;
    }
    const confidenceScore = this.toDecimal(extra.confidenceScore);
    if (confidenceScore !== undefined) {
      payload.aiConfidenceScore = confidenceScore;
    }
    const reviewerComment = this.toStringOr(extra.reviewerComment, undefined);
    if (reviewerComment) {
      payload.reviewFeedback = { reviewerComment, reviewedBy: this.toStringOr(extra.reviewedBy, undefined) ?? null };
    }
    return payload;
  }

  private buildImplementationPlanUpsertInput(extra: Record<string, unknown>) {
    const payload: Partial<Prisma.ImplementationPlanUncheckedCreateInput> = {};
    if (extra.roadmap) {
      payload.roadmapJson = extra.roadmap;
    }
    if (extra.milestones) {
      payload.milestoneJson = extra.milestones;
    }
    if (extra.kpis) {
      payload.kpiJson = extra.kpis;
    }
    if (extra.risks) {
      payload.riskRegisterJson = extra.risks;
    }
    const policyBriefUri = this.toStringOr(extra.policyBriefUri, undefined);
    if (policyBriefUri) {
      payload.policyBriefUri = policyBriefUri;
    }
    const reviewerComment = this.toStringOr(extra.reviewerComment, undefined);
    if (reviewerComment) {
      payload.reviewFeedback = { reviewerComment, reviewedBy: this.toStringOr(extra.reviewedBy, undefined) ?? null };
    }
    return payload;
  }

  private mapProblemStatement(record: ProblemStatement) {
    const feedback = (record.reviewFeedback ?? {}) as Record<string, unknown>;
    const reviewerComment = typeof feedback.reviewerComment === 'string' ? feedback.reviewerComment : undefined;
    const reviewedBy = typeof feedback.reviewedBy === 'string' ? feedback.reviewedBy : undefined;
    return {
      problemId: record.problemId,
      projectId: record.projectId,
      rawProblemText: record.rawProblemText,
      reframedProblemText: record.reframedProblemText,
      rootCauses: this.ensureStringArray(record.rootCauseJson),
      stakeholders: this.ensureStringArray(record.stakeholderMapJson),
      competencyGaps: this.ensureStringArray(record.competencyGapJson),
      workflowState: record.workflowState,
      confidenceScore: this.toNumber(record.aiConfidenceScore),
      reviewerComment,
      reviewedBy,
    };
  }

  private mapDecisionOption(record: DecisionOption) {
    return {
      decisionOptionId: record.decisionOptionId,
      projectId: record.projectId,
      optionRank: record.optionRank,
      optionTitle: record.optionTitle,
      optionDescription: record.optionDescription,
      benefitScore: this.toNumber(record.benefitScore),
      riskScore: this.toNumber(record.riskScore),
      feasibilityScore: this.toNumber(record.feasibilityScore),
      selectedFlag: record.selectedFlag,
    };
  }

  private mapImplementationPlan(record: ImplementationPlan) {
    const feedback = (record.reviewFeedback ?? {}) as Record<string, unknown>;
    const reviewerComment = typeof feedback.reviewerComment === 'string' ? feedback.reviewerComment : undefined;
    return { ...record, reviewerComment };
  }

  private mapImpactMetric(record: ImpactMetric) {
    return {
      ...record,
      baselineValue: this.toNumber(record.baselineValue),
      targetValue: this.toNumber(record.targetValue),
      actualValue: this.toNumber(record.actualValue),
    };
  }

  private mapTaiScore(record: TaiScore) {
    return {
      ...record,
      problemComplexityScore: this.toNumber(record.problemComplexityScore),
      decisionQualityScore: this.toNumber(record.decisionQualityScore),
      impactScore: this.toNumber(record.impactScore),
      reflectiveMaturityScore: this.toNumber(record.reflectiveMaturityScore),
      totalTaiScore: this.toNumber(record.totalTaiScore),
    };
  }

  private async resolveProgram(identifier: unknown, tenantId: string, fallbackProgramId: string) {
    if (typeof identifier === 'string' && identifier.length > 0) {
      if (this.isUuid(identifier)) {
        const program = await this.prisma.program.findUnique({ where: { programId: identifier } });
        if (program) {
          return program;
        }
      }
      const program = await this.prisma.program.findFirst({
        where: { tenantId, OR: [{ programCode: identifier }, { programName: identifier }] },
      });
      if (program) {
        return program;
      }
    }
    const fallback = await this.prisma.program.findUnique({ where: { programId: fallbackProgramId } });
    if (!fallback) {
      throw new NotFoundException('Program not found');
    }
    return fallback;
  }

  private async resolveCohort(identifier: unknown, tenantId: string, fallbackCohortId?: string) {
    if (typeof identifier === 'string' && identifier.length > 0) {
      if (this.isUuid(identifier)) {
        const cohort = await this.prisma.cohort.findUnique({ where: { cohortId: identifier } });
        if (cohort) {
          return cohort;
        }
      }
      const cohort = await this.prisma.cohort.findFirst({
        where: { cohortName: identifier, program: { tenantId } },
      });
      if (cohort) {
        return cohort;
      }
    }
    if (!fallbackCohortId) {
      const program = await this.prisma.program.findFirst({ where: { tenantId }, orderBy: { createdAt: 'asc' } });
      if (!program) {
        throw new NotFoundException('Program not found');
      }
      return this.ensureCohort(program.programId);
    }
    const fallback = await this.prisma.cohort.findUnique({ where: { cohortId: fallbackCohortId } });
    if (!fallback) {
      throw new NotFoundException('Cohort not found');
    }
    return fallback;
  }

  private slugify(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `program-${Date.now()}`;
  }

  private toStringOr(value: unknown, fallback: string): string;
  private toStringOr(value: unknown, fallback?: string): string | undefined;
  private toStringOr(value: unknown, fallback?: string) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
    return fallback;
  }

  private toNumber(value: Prisma.Decimal | number | null | undefined) {
    if (value === null || value === undefined) {
      return undefined;
    }
    return typeof value === 'number' ? value : Number(value);
  }

  private toDecimal(value: unknown, fallback?: number) {
    if (value === null || value === undefined) {
      return fallback;
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return fallback;
    }
    return numeric;
  }

  private ensureStringArray(value: Prisma.JsonValue | null | undefined) {
    if (!Array.isArray(value)) {
      return [];
    }
    return value.filter((item): item is string => typeof item === 'string');
  }

  private isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }
}
