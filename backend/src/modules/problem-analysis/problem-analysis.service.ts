import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkflowState, WorkflowStateService } from '../../common/workflow/workflow-state.service';
import { WorkspaceStoreService } from '../../common/workspace-store.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ProblemAnalysisService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workflowStateService: WorkflowStateService,
    private readonly workspaceStoreService: WorkspaceStoreService,
    private readonly auditService: AuditService,
  ) {}

  upsertProblemStatement(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'problem_statement', 'create');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.upsertProblemStatement(projectId, body);
  }

  submitProblemStatement(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'problem_statement', 'submit');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    const problemStatement = this.workspaceStoreService.getProblemStatement(projectId);
    if (!problemStatement) {
      throw new BadRequestException('Problem statement draft is required before submission');
    }
    this.workflowStateService.assertTransition(problemStatement.workflowState as WorkflowState, 'submitted');
    const updated = this.workspaceStoreService.updateProblemState(projectId, 'submitted');
    this.auditService.log('submit', 'problem_statement', String(updated.problemId));
    return updated;
  }

  runProblemAnalysis(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'problem_statement', 'create');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.updateProblemState(projectId, 'draft', {
      projectId,
      reframedProblemText: 'AI-generated reframed problem statement.',
      rootCauses: ['Root cause A', 'Root cause B'],
      stakeholders: ['Stakeholder A', 'Stakeholder B'],
      confidenceScore: 0.84,
    });
  }

  reviewProblemStatement(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'problem_statement', 'review');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    const problemStatement = this.workspaceStoreService.getProblemStatement(projectId);
    if (!problemStatement) {
      throw new BadRequestException('Problem statement does not exist');
    }
    const decision: WorkflowState = body.decision === 'approved' ? 'approved' : 'revision_required';
    const currentState: WorkflowState = problemStatement.workflowState === 'submitted' ? 'under_review' : (problemStatement.workflowState as WorkflowState);
    this.workflowStateService.assertTransition(currentState, decision);
    const updated = this.workspaceStoreService.updateProblemState(projectId, decision, {
      reviewerComment: body.reviewerComment,
      reviewedBy: user.userId,
    });
    this.auditService.log(decision, 'problem_statement', String(updated.problemId));
    return updated;
  }
}
