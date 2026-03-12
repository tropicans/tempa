import { Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkspaceStoreService } from '../../common/workspace-store.service';

@Injectable()
export class MonitoringService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workspaceStoreService: WorkspaceStoreService,
  ) {}

  async createProgressLog(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'progress_log', 'create');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.createProgressLog(projectId, body, user);
  }

  async createImpactMetric(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'impact_metric', 'create');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.createImpactMetric(projectId, body);
  }
}
