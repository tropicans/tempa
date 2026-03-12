import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import type { UserRole } from '../current-user';

export type JwtPayload = {
    sub: string;       // userId
    name: string;      // fullName
    role: UserRole;
    tenantId: string;
    iat?: number;
    exp?: number;
};

@Injectable()
export class JwtService {
    private readonly secret: string;
    private readonly expiresIn: number;

    constructor() {
        this.secret = process.env.JWT_SECRET ?? 'tempa-dev-secret-change-in-production';
        this.expiresIn = parseInt(process.env.JWT_EXPIRES_IN_SECONDS ?? '86400', 10); // 24h in seconds
    }

    sign(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    }

    verify(token: string): JwtPayload {
        return jwt.verify(token, this.secret) as JwtPayload;
    }

    decode(token: string): JwtPayload | null {
        const decoded = jwt.decode(token);
        return decoded as JwtPayload | null;
    }
}
