import { Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkspaceStoreService } from '../../common/workspace-store.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class DecisionDesignService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workspaceStoreService: WorkspaceStoreService,
    private readonly auditService: AuditService,
  ) {}

  async generateDecisionOptions(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'decision_option', 'generate');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    const options = [
      {
        decisionOptionId: 'option-1',
        projectId,
        optionTitle: 'Intervention A',
        optionDescription: 'Placeholder option A.',
      },
      {
        decisionOptionId: 'option-2',
        projectId,
        optionTitle: 'Intervention B',
        optionDescription: 'Placeholder option B.',
      },
    ];
    return this.workspaceStoreService.saveDecisionOptions(projectId, options);
  }

  async selectDecisionOption(projectId: string, decisionOptionId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'decision_option', 'select');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.selectDecisionOption(projectId, decisionOptionId);
  }

  async reviewDecisionPackage(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'decision_option', 'review');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    const selected = (await this.workspaceStoreService.getDecisionOptions(projectId)).find((option) => option.selectedFlag === true);
    const result = { projectId, selectedDecisionOptionId: selected?.decisionOptionId, ...body };
    this.auditService.log(String(body.decision ?? 'review'), 'decision_package', String(selected?.decisionOptionId ?? projectId));
    return result;
  }
}
