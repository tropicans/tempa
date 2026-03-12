import { NextRequest, NextResponse } from 'next/server';

import { getApiBaseUrl } from '@/lib/api';

const allowedRoles = new Set(['participant', 'mentor', 'program_admin', 'executive_viewer', 'platform_operator']);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ role: string }> },
) {
  const { role } = await context.params;
  const nextRole = allowedRoles.has(role) ? role : 'participant';

  /* ── Map role to demo userId ──────────────────────────────────── */
  const userIdMap: Record<string, string> = {
    participant: 'demo-user',
    mentor: 'mentor-demo',
    program_admin: 'admin-demo',
    executive_viewer: 'executive-demo',
    platform_operator: 'operator-demo',
  };

  const userId = userIdMap[nextRole] ?? 'demo-user';

  /* ── Call backend /auth/login to get a real JWT ─────────────── */
  let token = '';
  let fullName = 'Demo User';
  try {
    const apiBase = getApiBaseUrl();
    const res = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: nextRole }),
    });
    if (res.ok) {
      const data = await res.json();
      token = data.token;
      fullName = data.user?.fullName ?? fullName;
    }
  } catch {
    // Fallback: no token, will use legacy headers
  }

  /* ── Build redirect URL using host header (Docker-safe) ──────── */
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'http';
  const host = forwardedHost ?? request.headers.get('host') ?? 'localhost:3000';
  const origin = `${forwardedProto}://${host}`;

  const redirectPath = routeForRole(nextRole);
  const redirectUrl = new URL(redirectPath, origin);

  const response = NextResponse.redirect(redirectUrl);

  /* ── Clear ALL old session cookies first to prevent stale state ── */
  response.cookies.delete('tempa-role');
  response.cookies.delete('tempa-user-id');
  response.cookies.delete('tempa-user-name');
  response.cookies.delete('tempa-token');

  /* ── Set fresh cookies ──────────────────────────────────────── */
  response.cookies.set('tempa-role', nextRole, { path: '/', httpOnly: false });
  response.cookies.set('tempa-user-id', userId, { path: '/', httpOnly: false });
  response.cookies.set('tempa-user-name', fullName, { path: '/', httpOnly: false });

  if (token) {
    response.cookies.set('tempa-token', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    });
  }

  return response;
}

function routeForRole(role: string) {
  switch (role) {
    case 'mentor':
      return '/app/mentor/dashboard';
    case 'program_admin':
      return '/app/admin/programs';
    case 'executive_viewer':
      return '/app/executive/dashboard';
    case 'platform_operator':
      return '/app/platform/monitoring';
    default:
      return '/app/participant/dashboard';
  }
}
