import { Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkspaceStoreService } from '../../common/workspace-store.service';

@Injectable()
export class DashboardsService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workspaceStoreService: WorkspaceStoreService,
  ) {}

  async getParticipantDashboard(user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'dashboard', 'participant');
    await this.workspaceStoreService.seedDemoProjectForUser(user);
    const summary = await this.workspaceStoreService.getDashboardSummary(user);
    return {
      activeProjectCount: summary.activeProjectCount,
      currentPhase: summary.currentPhase,
      latestTaiScore: summary.latestTaiScore,
    };
  }

  async getMentorDashboard(user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'dashboard', 'mentor');
    const summary = await this.workspaceStoreService.getDashboardSummary(user);
    const recentProjects = await this.workspaceStoreService.listProjects(user);
    return {
      assignedParticipantCount: summary.assignedParticipantCount,
      pendingReviewCount: summary.pendingReviewCount,
      recentProjectIds: recentProjects.map((project) => project.projectId).slice(0, 5),
    };
  }

  async getExecutiveDashboard(user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'dashboard', 'executive');
    const summary = await this.workspaceStoreService.getDashboardSummary(user);
    return {
      totalPrograms: summary.totalPrograms,
      totalProjects: summary.totalProjects,
      averageTaiScore: summary.averageTaiScore,
      implementationRate: summary.implementationRate,
    };
  }
}
