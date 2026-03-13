'use client';

import { ReactNode, useEffect } from 'react';
import { Sidebar } from './sidebar';

type AppFrameProps = {
  role: string;
  fullName: string;
  children: ReactNode;
};

export function AppFrame({ role, fullName, children }: AppFrameProps) {
  // Set role-based accent colors via data attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-role', role);
    return () => {
      document.documentElement.removeAttribute('data-role');
    };
  }, [role]);

  return (
    <div className="app-frame-shell subtle-grid">
      <div className="app-frame">
        <Sidebar role={role} fullName={fullName} />
        <div className="app-content-shell">
          <div className="app-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
