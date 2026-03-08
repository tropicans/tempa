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

  getParticipantDashboard(user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'dashboard', 'participant');
    this.workspaceStoreService.seedDemoProjectForUser(user);
    const summary = this.workspaceStoreService.getDashboardSummary(user);
    return {
      activeProjectCount: summary.activeProjectCount,
      currentPhase: summary.currentPhase,
      latestTaiScore: summary.latestTaiScore,
    };
  }

  getMentorDashboard(user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'dashboard', 'mentor');
    const summary = this.workspaceStoreService.getDashboardSummary(user);
    return {
      assignedParticipantCount: summary.assignedParticipantCount,
      pendingReviewCount: summary.pendingReviewCount,
      recentProjectIds: this.workspaceStoreService.listProjects(user).map((project) => project.projectId).slice(0, 5),
    };
  }

  getExecutiveDashboard(user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'dashboard', 'executive');
    const summary = this.workspaceStoreService.getDashboardSummary(user);
    return {
      totalPrograms: summary.totalPrograms,
      totalProjects: summary.totalProjects,
      averageTaiScore: summary.averageTaiScore,
      implementationRate: summary.implementationRate,
    };
  }
}
