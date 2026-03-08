import { Injectable } from '@nestjs/common';

import { AuthorizationService } from '../../common/authorization/authorization.service';
import type { CurrentUser } from '../../common/current-user';
import { WorkspaceStoreService } from '../../common/workspace-store.service';

@Injectable()
export class ProgramsService {
  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly workspaceStoreService: WorkspaceStoreService,
  ) {}

  listPrograms(user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'program', 'read');
    return this.workspaceStoreService.listPrograms();
  }

  createProgram(body: Record<string, unknown>, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'program', 'create');
    return this.workspaceStoreService.createProgram(body);
  }

  getProgram(programId: string, user: CurrentUser) {
    this.authorizationService.assertAccess(user, 'program', 'read');
    return this.workspaceStoreService.getProgram(programId);
  }
}
