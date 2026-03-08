import { Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkspaceStoreService } from '../../common/workspace-store.service';

@Injectable()
export class CohortsService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workspaceStoreService: WorkspaceStoreService,
  ) {}

  createCohort(body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'cohort', 'create');
    return this.workspaceStoreService.createCohort(body);
  }

  createEnrollment(cohortId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'enrollment', 'create');
    return this.workspaceStoreService.createEnrollment(cohortId, body);
  }

  createMentorAssignment(cohortId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'mentor_assignment', 'create');
    return this.workspaceStoreService.createMentorAssignment(cohortId, body);
  }
}
