import Link from 'next/link';

import { AppShell } from '@/components/app-shell';
import { PageCard } from '@/components/page-card';

export default function UnauthorizedPage() {
  return (
    <AppShell title="Access Denied" subtitle="You do not have permission to view this page.">
      <section className="card hero-panel">
        <div className="hero-copy">
          <div className="section-eyebrow">Authorization error</div>
          <h2 className="hero-title">Akses ditolak untuk role Anda saat ini.</h2>
          <p className="muted">
            Anda mencoba mengakses halaman yang tidak tersedia untuk role Anda. Silakan login ulang dengan role yang sesuai, atau hubungi administrator program.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/login">Back to login</Link>
          </div>
        </div>
      </section>
      <PageCard eyebrow="Help" title="What to do" description="Common steps to resolve access issues.">
        <div className="journey-list">
          <div className="journey-step"><strong>1</strong><div><b>Switch role</b><p className="muted">Go back to login and choose the correct role.</p></div></div>
          <div className="journey-step"><strong>2</strong><div><b>Contact admin</b><p className="muted">If you believe you should have access, contact your program administrator.</p></div></div>
          <div className="journey-step"><strong>3</strong><div><b>Check session</b><p className="muted">Your session may have expired. Try logging in again.</p></div></div>
        </div>
      </PageCard>
    </AppShell>
  );
}
