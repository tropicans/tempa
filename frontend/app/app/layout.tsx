import { ReactNode } from 'react';

import { AppFrame } from '@/components/app-frame';
import { getSessionRole, getSessionUser } from '@/lib/session';

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const role = await getSessionRole();
  const user = await getSessionUser();

  return <AppFrame role={role} fullName={user.fullName}>{children}</AppFrame>;
}
