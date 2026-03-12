import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from './jwt.service';
import type { UserRole } from '../current-user';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<{
            headers: Record<string, string | undefined>;
            user?: { userId: string; fullName: string; role: UserRole; tenantId: string };
        }>();

        /* ── 1. Try JWT Bearer token ──────────────────────────────────── */
        const authHeader = request.headers['authorization'];
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            try {
                const payload = this.jwtService.verify(token);
                request.user = {
                    userId: payload.sub,
                    fullName: payload.name,
                    role: payload.role,
                    tenantId: payload.tenantId,
                };
                return true;
            } catch {
                throw new UnauthorizedException('Invalid or expired token');
            }
        }

        /* ── 2. Fallback: legacy x-tempa-* headers (dev mode only) ──── */
        const legacyRole = request.headers['x-tempa-role'];
        const legacyUserId = request.headers['x-tempa-user-id'];
        if (legacyRole && legacyUserId) {
            request.user = {
                userId: legacyUserId,
                fullName: request.headers['x-tempa-user-name'] ?? 'Legacy User',
                role: legacyRole as UserRole,
                tenantId: 'default',
            };
            return true;
        }

        throw new UnauthorizedException('No authentication credentials provided');
    }
}
