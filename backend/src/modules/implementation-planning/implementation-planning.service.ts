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

  upsertImplementationPlan(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'implementation_plan', 'create');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.upsertImplementationPlan(projectId, body);
  }

  submitImplementationPlan(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'implementation_plan', 'submit');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    const implementationPlan = this.workspaceStoreService.getImplementationPlan(projectId);
    if (!implementationPlan) {
      throw new BadRequestException('Implementation plan draft is required before submission');
    }
    this.workflowStateService.assertTransition(implementationPlan.workflowState as WorkflowState, 'submitted');
    const updated = this.workspaceStoreService.updateImplementationPlanState(projectId, 'submitted');
    this.auditService.log('submit', 'implementation_plan', String(updated.implementationPlanId));
    return updated;
  }

  reviewImplementationPlan(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'implementation_plan', 'review');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    const implementationPlan = this.workspaceStoreService.getImplementationPlan(projectId);
    if (!implementationPlan) {
      throw new BadRequestException('Implementation plan does not exist');
    }
    const decision: WorkflowState = body.decision === 'approved' ? 'approved' : 'revision_required';
    const currentState: WorkflowState = implementationPlan.workflowState === 'submitted'
      ? 'under_review'
      : (implementationPlan.workflowState as WorkflowState);
    this.workflowStateService.assertTransition(currentState, decision);
    const updated = this.workspaceStoreService.updateImplementationPlanState(projectId, decision, {
      reviewerComment: body.reviewerComment,
      reviewedBy: user.userId,
    });
    if (decision === 'approved') {
      this.workspaceStoreService.markProjectImplementationStarted(projectId);
    }
    this.auditService.log(decision, 'implementation_plan', String(updated.implementationPlanId));
    return updated;
  }
}
