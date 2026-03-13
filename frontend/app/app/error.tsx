'use client';

import { AlertCircle } from 'lucide-react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="app-content">
      <div className="empty-state" style={{ minHeight: '300px' }}>
        <div className="empty-state-icon" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
          <AlertCircle size={24} />
        </div>
        <strong>Something went wrong</strong>
        <p className="muted">{error.message || 'An unexpected error occurred. Please try again.'}</p>
        <button className="button" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
