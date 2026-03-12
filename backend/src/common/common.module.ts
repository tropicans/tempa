import { Global, Module } from '@nestjs/common';

import { AuthController } from './auth/auth.controller';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from './auth/jwt.service';
import { AuthorizationService } from './authorization/authorization.service';
import { PrismaService } from './prisma/prisma.service';
import { WorkflowStateService } from './workflow/workflow-state.service';
import { WorkspaceStoreService } from './workspace-store.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [AuthGuard, AuthorizationService, JwtService, PrismaService, WorkflowStateService, WorkspaceStoreService],
  exports: [AuthGuard, AuthorizationService, JwtService, PrismaService, WorkflowStateService, WorkspaceStoreService],
})
export class CommonModule { }
