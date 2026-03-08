import { NextRequest, NextResponse } from 'next/server';

const routePermissions: Record<string, string[]> = {
  '/app/participant': ['participant'],
  '/app/mentor': ['mentor'],
  '/app/admin': ['program_admin'],
  '/app/executive': ['executive_viewer', 'program_admin', 'platform_operator'],
  '/app/platform': ['platform_operator'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/app')) {
    return NextResponse.next();
  }

  const role = request.cookies.get('tempa-role')?.value ?? 'participant';

  for (const [prefix, allowedRoles] of Object.entries(routePermissions)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
