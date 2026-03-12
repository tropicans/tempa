import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkflowState, WorkflowStateService } from '../../common/workflow/workflow-state.service';
import { WorkspaceStoreService } from '../../common/workspace-store.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ImplementationPlanningService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workflowStateService: WorkflowStateService,
    private readonly workspaceStoreService: WorkspaceStoreService,
    private readonly auditService: AuditService,
  ) {}

  async upsertImplementationPlan(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'implementation_plan', 'create');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.upsertImplementationPlan(projectId, body);
  }

  async submitImplementationPlan(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'implementation_plan', 'submit');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    const implementationPlan = await this.workspaceStoreService.getImplementationPlan(projectId);
    if (!implementationPlan) {
      throw new BadRequestException('Implementation plan draft is required before submission');
    }
    this.workflowStateService.assertTransition(implementationPlan.workflowState as WorkflowState, 'submitted');
    const updated = await this.workspaceStoreService.updateImplementationPlanState(projectId, 'submitted');
    this.auditService.log('submit', 'implementation_plan', String(updated.implementationPlanId));
    return updated;
  }

  async reviewImplementationPlan(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'implementation_plan', 'review');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    const implementationPlan = await this.workspaceStoreService.getImplementationPlan(projectId);
    if (!implementationPlan) {
      throw new BadRequestException('Implementation plan does not exist');
    }
    const decision: WorkflowState = body.decision === 'approved' ? 'approved' : 'revision_required';
    const currentState: WorkflowState = implementationPlan.workflowState === 'submitted'
      ? 'under_review'
      : (implementationPlan.workflowState as WorkflowState);
    this.workflowStateService.assertTransition(currentState, decision);
    const updated = await this.workspaceStoreService.updateImplementationPlanState(projectId, decision, {
      reviewerComment: body.reviewerComment,
      reviewedBy: user.userId,
    });
    if (decision === 'approved') {
      await this.workspaceStoreService.markProjectImplementationStarted(projectId);
    }
    this.auditService.log(decision, 'implementation_plan', String(updated.implementationPlanId));
    return updated;
  }
}
