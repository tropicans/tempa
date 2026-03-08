import { Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkspaceStoreService } from '../../common/workspace-store.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workspaceStoreService: WorkspaceStoreService,
  ) {}

  listProjects(user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'project', 'read');
    this.workspaceStoreService.seedDemoProjectForUser(user);
    return this.workspaceStoreService.listProjects(user);
  }

  createProject(body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'project', 'create');
    return this.workspaceStoreService.createProject(body, user);
  }

  getProject(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'project', 'read');
    return this.workspaceStoreService.assertProjectAccess(projectId, user);
  }

  createArtifact(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'artifact', 'create');
    this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.createArtifact(projectId, body, user);
  }
}
