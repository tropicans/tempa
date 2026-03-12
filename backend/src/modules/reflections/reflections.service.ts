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

  async upsertReflection(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'reflection', 'create');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.upsertReflection(projectId, body);
  }

  async submitReflection(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'reflection', 'submit');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    const reflection = await this.workspaceStoreService.getReflection(projectId);
    if (!reflection) {
      throw new BadRequestException('Reflection draft is required before submission');
    }
    this.workflowStateService.assertTransition(reflection.workflowState as WorkflowState, 'submitted');
    const updated = await this.workspaceStoreService.updateReflectionState(projectId, 'submitted');
    this.auditService.log('submit', 'reflection', String(updated.reflectionId));
    return updated;
  }

  async runReflectionAnalysis(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'reflection', 'create');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.updateReflectionState(projectId, 'draft', {
      projectId,
      summary: 'AI reflection summary placeholder.',
      biasIndicators: ['Potential confirmation bias'],
      growthIndicators: ['Improved stakeholder analysis'],
      confidenceScore: 0.8,
    });
  }
}
