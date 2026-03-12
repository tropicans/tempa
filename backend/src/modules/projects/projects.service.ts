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

  async listProjects(user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'project', 'read');
    await this.workspaceStoreService.seedDemoProjectForUser(user);
    return this.workspaceStoreService.listProjects(user);
  }

  async createProject(body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'project', 'create');
    return this.workspaceStoreService.createProject(body, user);
  }

  async getProject(projectId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'project', 'read');
    return this.workspaceStoreService.assertProjectAccess(projectId, user);
  }

  async createArtifact(projectId: string, body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'artifact', 'create');
    await this.workspaceStoreService.assertProjectAccess(projectId, user);
    return this.workspaceStoreService.createArtifact(projectId, body, user);
  }
}
