import { Body, Controller, Post, Get, UnauthorizedException, Req } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from './jwt.service';
import type { UserRole } from '../current-user';

type LoginBody = {
    userId: string;  // externalIdentityId
    role?: UserRole;
};

@Controller('auth')
export class AuthController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    @Post('login')
    async login(@Body() body: LoginBody) {
        const userId = body.userId?.trim();
        if (!userId) {
            throw new UnauthorizedException('userId is required');
        }

        /* ── Look up the user in the database ─────────────────────────── */
        const user = await this.prisma.userAccount.findFirst({
            where: { externalIdentityId: userId, status: 'active' },
            include: {
                roles: {
                    include: { role: true },
                },
            },
        });

        if (!user) {
            throw new UnauthorizedException(`User "${userId}" not found or inactive`);
        }

        /* ── Determine role ───────────────────────────────────────────── */
        const requestedRole = body.role;
        const userRoles: string[] = user.roles.map((ur: { role: { roleCode: string } }) => ur.role.roleCode);

        let effectiveRole: UserRole;
        if (requestedRole && userRoles.includes(requestedRole)) {
            effectiveRole = requestedRole;
        } else if (userRoles.length > 0) {
            effectiveRole = userRoles[0] as UserRole;
        } else {
            effectiveRole = 'participant';
        }

        /* ── Issue JWT ────────────────────────────────────────────────── */
        const token = this.jwtService.sign({
            sub: user.externalIdentityId ?? userId,
            name: user.fullName,
            role: effectiveRole,
            tenantId: user.tenantId,
        });

        return {
            token,
            user: {
                userId: user.externalIdentityId ?? userId,
                fullName: user.fullName,
                email: user.email,
                role: effectiveRole,
                roles: userRoles,
            },
        };
    }

    @Get('me')
    async me(@Req() req: { user?: { userId: string; fullName: string; role: UserRole; tenantId: string } }) {
        if (!req.user) {
            throw new UnauthorizedException('Not authenticated');
        }
        return {
            userId: req.user.userId,
            fullName: req.user.fullName,
            role: req.user.role,
            tenantId: req.user.tenantId,
        };
    }
}
