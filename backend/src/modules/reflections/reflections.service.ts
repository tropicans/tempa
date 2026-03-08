import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkflowState, WorkflowStateService } from '../../common/workflow/workflow-state.service';
import { WorkspaceStoreService } from '../../common/workspace-store.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ReflectionsService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workflowStateService: WorkflowStateService,
    private readonly workspaceStoreService: WorkspaceStoreService,
    private readonly auditService: AuditService,
  ) {}

  upsertReflection(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'reflection', 'create');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.upsertReflection(projectId, body);
  }

  submitReflection(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'reflection', 'submit');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    const reflection = this.workspaceStoreService.getReflection(projectId);
    if (!reflection) {
      throw new BadRequestException('Reflection draft is required before submission');
    }
    this.workflowStateService.assertTransition(reflection.workflowState as WorkflowState, 'submitted');
    const updated = this.workspaceStoreService.updateReflectionState(projectId, 'submitted');
    this.auditService.log('submit', 'reflection', String(updated.reflectionId));
    return updated;
  }

  runReflectionAnalysis(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'reflection', 'create');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.updateReflectionState(projectId, 'draft', {
      projectId,
      summary: 'AI reflection summary placeholder.',
      biasIndicators: ['Potential confirmation bias'],
      growthIndicators: ['Improved stakeholder analysis'],
      confidenceScore: 0.8,
    });
  }
}
