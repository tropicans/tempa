import { Global, Module } from '@nestjs/common';

import { AuthorizationService } from './authorization/authorization.service';
import { WorkflowStateService } from './workflow/workflow-state.service';
import { WorkspaceStoreService } from './workspace-store.service';

@Global()
@Module({
  providers: [AuthorizationService, WorkflowStateService, WorkspaceStoreService],
  exports: [AuthorizationService, WorkflowStateService, WorkspaceStoreService],
})
export class CommonModule {}
