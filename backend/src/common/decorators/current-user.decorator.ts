import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { CurrentUser, UserRole } from '../current-user';

const defaultRole: UserRole = 'participant';

export const CurrentUserDecorator = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentUser => {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: { userId: string; fullName: string; role: UserRole; tenantId?: string };
    }>();

    /* ── If AuthGuard has already parsed the user, use that ─────── */
    if (request.user) {
      return {
        userId: request.user.userId,
        fullName: request.user.fullName,
        role: request.user.role,
      };
    }

    /* ── Fallback: legacy header-based auth (dev only) ──────────── */
    const role = (request.headers['x-tempa-role'] as UserRole | undefined) ?? defaultRole;
    const userId = request.headers['x-tempa-user-id'] ?? 'demo-user';
    const fullName = request.headers['x-tempa-user-name'] ?? 'Demo User';

    return { userId, fullName, role };
  },
);
