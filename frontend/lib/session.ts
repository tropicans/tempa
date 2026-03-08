import { cookies } from 'next/headers';

export async function getSessionRole() {
  const cookieStore = await cookies();
  return cookieStore.get('tempa-role')?.value ?? 'participant';
}

export async function getSessionUser() {
  const role = await getSessionRole();

  switch (role) {
    case 'mentor':
      return { role, userId: 'mentor-demo', fullName: 'Demo Mentor' };
    case 'program_admin':
      return { role, userId: 'admin-demo', fullName: 'Demo Program Admin' };
    case 'executive_viewer':
      return { role, userId: 'executive-demo', fullName: 'Demo Executive' };
    case 'platform_operator':
      return { role, userId: 'operator-demo', fullName: 'Demo Operator' };
    default:
      return { role: 'participant', userId: 'demo-user', fullName: 'Demo Participant' };
  }
}

export async function getSessionApiHeaders() {
  const user = await getSessionUser();
  return {
    'x-tempa-role': user.role,
    'x-tempa-user-id': user.userId,
    'x-tempa-user-name': user.fullName,
  };
}
