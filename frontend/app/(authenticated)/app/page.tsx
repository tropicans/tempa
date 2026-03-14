import { redirect } from 'next/navigation';

import { getSessionRole } from '@/lib/session';

export default async function AppEntryPage() {
  const role = await getSessionRole();

  switch (role) {
    case 'mentor':
      redirect('/app/mentor/dashboard');
    case 'program_admin':
      redirect('/app/admin/programs');
    case 'executive_viewer':
      redirect('/app/executive/dashboard');
    case 'platform_operator':
      redirect('/app/platform/monitoring');
    default:
      redirect('/app/participant/dashboard');
  }
}
