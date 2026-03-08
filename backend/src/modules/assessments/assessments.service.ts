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

  createAssessment(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'assessment', 'create');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    const assessment = this.workspaceStoreService.saveAssessment(projectId, body, user);
    this.auditService.log('create', 'assessment', String(assessment.assessmentResultId));
    return assessment;
  }

  getTaiScore(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'tai_score', 'read');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.getOrCreateTaiScore(projectId);
  }

  publishTaiScore(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'tai_score', 'publish');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    const score = this.workspaceStoreService.getOrCreateTaiScore(projectId);
    this.workspaceStoreService.closeProject(projectId);
    this.auditService.log('publish', 'tai_score', String(score.taiScoreId));
    return score;
  }
}
