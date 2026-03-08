import { NextRequest, NextResponse } from 'next/server';

const allowedRoles = new Set(['participant', 'mentor', 'program_admin', 'executive_viewer', 'platform_operator']);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ role: string }> },
) {
  const { role } = await context.params;
  const nextRole = allowedRoles.has(role) ? role : 'participant';
  const response = NextResponse.redirect(new URL(routeForRole(nextRole), request.url));
  response.cookies.set('tempa-role', nextRole, { path: '/', httpOnly: false });
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
