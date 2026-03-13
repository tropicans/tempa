import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="app-content">
      <div className="empty-state" style={{ minHeight: '300px' }}>
        <div className="empty-state-icon">
          <FileQuestion size={24} />
        </div>
        <strong>Page not found</strong>
        <p className="muted">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link className="button" href="/app">
          Back to workspace
        </Link>
      </div>
    </div>
  );
}
