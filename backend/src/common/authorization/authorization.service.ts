import { ForbiddenException, Injectable } from '@nestjs/common';

import type { CurrentUser, UserRole } from '../current-user';

type ResourceAction = `${string}:${string}`;

const permissions: Record<UserRole, ResourceAction[]> = {
  participant: [
    'program:read',
    'cohort:read',
    'project:create',
    'project:read',
    'project:update',
    'artifact:create',
    'problem_statement:create',
    'problem_statement:submit',
    'decision_option:generate',
    'decision_option:select',
    'implementation_plan:create',
    'implementation_plan:submit',
    'progress_log:create',
    'impact_metric:create',
    'reflection:create',
    'reflection:submit',
    'tai_score:read',
    'dashboard:participant',
  ],
  mentor: [
    'program:read',
    'cohort:read',
    'project:read',
    'problem_statement:review',
    'decision_option:generate',
    'decision_option:review',
    'implementation_plan:review',
    'reflection:review',
    'assessment:create',
    'tai_score:publish',
    'dashboard:mentor',
  ],
  program_admin: [
    'program:create',
    'program:read',
    'program:update',
    'cohort:create',
    'cohort:read',
    'cohort:update',
    'enrollment:create',
    'mentor_assignment:create',
    'dashboard:executive',
  ],
  executive_viewer: ['dashboard:executive', 'project:read', 'program:read'],
  platform_operator: ['dashboard:executive', 'audit:read', 'system_config:update', 'project:read'],
};

@Injectable()
export class AuthorizationService {
  canAccess(role: UserRole, resource: string, action: string): boolean {
    return permissions[role].includes(`${resource}:${action}`);
  }

  assertAccess(user: CurrentUser, resource: string, action: string) {
    if (!this.canAccess(user.role, resource, action)) {
      throw new ForbiddenException(`Role ${user.role} cannot ${action} ${resource}`);
    }
  }
}
