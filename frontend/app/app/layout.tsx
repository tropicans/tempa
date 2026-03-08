import { ReactNode } from 'react';

import { getSessionRole } from '@/lib/session';

export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  await getSessionRole();
  return <>{children}</>;
}
