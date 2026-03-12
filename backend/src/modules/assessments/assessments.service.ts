import { Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkspaceStoreService } from '../../common/workspace-store.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class AssessmentsService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workspaceStoreService: WorkspaceStoreService,
    private readonly auditService: AuditService,
  ) {}

  async createAssessment(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'assessment', 'create');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    const assessment = await this.workspaceStoreService.saveAssessment(projectId, body, user);
    this.auditService.log('create', 'assessment', String(assessment.assessmentResultId));
    return assessment;
  }

  async getTaiScore(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'tai_score', 'read');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.getOrCreateTaiScore(projectId);
  }

  async publishTaiScore(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'tai_score', 'publish');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    const score = await this.workspaceStoreService.getOrCreateTaiScore(projectId);
    await this.workspaceStoreService.closeProject(projectId);
    this.auditService.log('publish', 'tai_score', String(score.taiScoreId));
    return score;
  }
}
