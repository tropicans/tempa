import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'http';
    const host = forwardedHost ?? request.headers.get('host') ?? 'localhost:3000';
    const origin = `${forwardedProto}://${host}`;

    const response = NextResponse.redirect(new URL('/login', origin));

    /* ── Clear all session cookies ────────────────────────────────── */
    response.cookies.delete('tempa-role');
    response.cookies.delete('tempa-user-id');
    response.cookies.delete('tempa-user-name');
    response.cookies.delete('tempa-token');

    return response;
}
