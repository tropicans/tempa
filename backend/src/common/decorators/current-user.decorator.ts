import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { CurrentUser, UserRole } from '../current-user';

const defaultRole: UserRole = 'participant';

export const CurrentUserDecorator = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUser => {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    const role = (request.headers['x-tempa-role'] as UserRole | undefined) ?? defaultRole;
    const userId = request.headers['x-tempa-user-id'] ?? 'demo-user';
    const fullName = request.headers['x-tempa-user-name'] ?? 'Demo User';

    return { userId, fullName, role };
  },
);
