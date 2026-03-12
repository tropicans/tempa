import { cookies } from 'next/headers';

export async function getSessionRole() {
  const cookieStore = await cookies();
  return cookieStore.get('tempa-role')?.value ?? 'participant';
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const role = cookieStore.get('tempa-role')?.value ?? 'participant';
  const userId = cookieStore.get('tempa-user-id')?.value ?? 'demo-user';
  const fullName = cookieStore.get('tempa-user-name')?.value ?? 'Demo Participant';

  return { role, userId, fullName };
}

export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('tempa-token')?.value;
}

export async function getSessionApiHeaders(): Promise<Record<string, string>> {
  const token = await getSessionToken();

  /* ── Prefer JWT Bearer if available ─────────────────────────── */
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }

  /* ── Fallback: legacy headers ───────────────────────────────── */
  const user = await getSessionUser();
  return {
    'x-tempa-role': user.role,
    'x-tempa-user-id': user.userId,
    'x-tempa-user-name': user.fullName,
  };
}
